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
import { Request } from '../types';
import api from '../utils/api';
import { certificateColumns } from '../utils/columns';
import { colorsByStatus } from '../utils/constants';
import { handleError } from '../utils/functions';
import { useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { requestStatusLabels } from '../utils/text';

const Certificates = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const { page, pageSize } = params;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading: isFormLoading } = useQuery(
    ['certificates'],
    () => api.getCertificateForm(),
    {
      onError: handleError,
      refetchOnWindowFocus: false,
    },
  );

  const renderStatusTag = (status) =>
    status && <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />;

  const mapTableData = (item) => {
    return {
      id: item.id,
      no: `#${item.id}`,
      form: item?.form,
      formTitle: item?.formConfig?.title,
      date: format(item.createdAt, 'yyyy MM dd'),
      productNames: item?.productNames?.join(', '),
      importingCountry: item?.importingCountry,
      productAmount: item?.productAmount,
      status: renderStatusTag(item.status),
    };
  };

  const { tableData, loading: isTableLoading } = useTableData({
    name: 'certificateRequests',
    endpoint: () => api.getCertificateRequests({ query: {}, page, pageSize }),
    mapData: (list: Request[]) => list.map((item) => mapTableData(item)),
    dependencyArray: [page, pageSize],
    enabled: !isFormLoading,
  });

  if (isFormLoading || isTableLoading) return <FullscreenLoader />;

  return (
    <TableWrapper title={'Sertfikatai'}>
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
        columns={certificateColumns}
        onClick={(item: any) => {
          navigate(slugs.certificateRequest(item.form, item.id));
        }}
        showPageSizeDropdown={true}
      />
      <FormSelectModal
        title="Naujas sertifikato prašymas"
        onClick={(form) => {
          navigate(slugs.certificateRequest(form, 'naujas'));
        }}
        onClose={() => setShowModal(false)}
        isVisible={showModal}
        forms={data?.forms || []}
      />
    </TableWrapper>
  );
};

export default Certificates;

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
