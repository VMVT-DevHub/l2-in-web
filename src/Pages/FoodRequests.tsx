import { Button, Table } from '@aplinkosministerija/design-system';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import FormSelectModal from '../components/FormSelectModal';
import FullscreenLoader from '../components/FullscreenLoader';
import StatusTag from '../components/StatusTag';
import TableWrapper from '../components/TableWrapper';
import api from '../utils/api';
import { foodRequestColumns } from '../utils/columns';
import { colorsByStatus } from '../utils/constants';
import { handleError } from '../utils/functions';
import { useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { foodReasonLabels, requestStatusLabels } from '../utils/text';

const FoodRequests = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const { page, pageSize } = params;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading: isFormLoading } = useQuery(['food'], () => api.getFoodForm(), {
    onError: handleError,
    refetchOnWindowFocus: false,
  });

  const renderStatusTag = (status) =>
    status && <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />;

  const mapTableData = (item) => {
    return {
      id: item.id,
      no: `#${item.id}`,
      reason: foodReasonLabels[item.form],
      date: format(item.createdAt, 'yyyy MM dd'),
      submitter: `${item.name || ''} ${item.lastName || ''}`,
      status: renderStatusTag(item.status),
      form: item.form,
    };
  };

  const { tableData, loading: isTableLoading } = useTableData({
    name: 'foodRequests',
    endpoint: () => api.getFoodRequests({ query: {}, page, pageSize }),
    mapData: (list: Request[]) => list.map((item) => mapTableData(item)),
    dependencyArray: [page, pageSize],
    enabled: !isFormLoading,
  });

  if (isTableLoading) return <FullscreenLoader />;

  return (
    <TableWrapper title={'Prašymai maisto tvarkymui'}>
      <TableButtonsRow>
        <TableButtonsInnerRow />
        <Button
          onClick={() => {
            setShowModal(true);
          }}
        >
          {'Naujas prašymas'}
        </Button>
      </TableButtonsRow>
      <Table
        loading={isTableLoading}
        notFoundInfo={{ text: 'Nėra sukurtų prašymų', onClick: () => {} }}
        data={tableData}
        columns={foodRequestColumns}
        onClick={(item: any) => {
          navigate(slugs.foodRequest(item.form, item.id));
        }}
        showPageSizeDropdown={true}
      />
      <FormSelectModal
        title="Naujas maisto tvarkymo subjekto prašymas"
        onClick={(form) => {
          navigate(slugs.foodRequest(form, 'naujas'));
        }}
        onClose={() => setShowModal(false)}
        isVisible={showModal}
        forms={data?.forms || []}
      />
    </TableWrapper>
  );
};

export default FoodRequests;

const TableButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
  margin: 16px 0;
`;

const TableButtonsInnerRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;
