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
import { animalDecisionColumns, animalRequestColumns } from '../utils/columns';
import { colorsByStatus } from '../utils/constants';
import { handleError, truncateList } from '../utils/functions';
import { useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { animalReasonLabels, decisionsStatusLabels, requestStatusLabels } from '../utils/text';

const AnimalRequestsDecisions = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const { page, pageSize } = params;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading: isFormLoading } = useQuery({
    queryKey: ['decision'],
    queryFn: () => api.getDecisions({ page, pageSize }),
    onError: handleError,
    refetchOnWindowFocus: false,
  });

  const renderStatusTag = (status) =>
    status && <StatusTag label={decisionsStatusLabels[status]} color={colorsByStatus[status]} />;

  const mapTableData = (item) => {
    const truncatedAddress = truncateList(item?.address);
    const truncatedActionTitle = truncateList(item?.action.title);

    return {
      id: item.id,
      no: `#${item.id}`,
      type: item.decisionTitle,
      typeId: item.decisionTitleId,
      actionPlaceTitle: item.actionPlaceTitle,
      address: truncatedAddress,
      actionTitle: truncatedActionTitle,
      date: item.date ? format(item.date, 'yyyy MM dd') : '',
      decider: item.decider,
      status: renderStatusTag(item.statusId),
    };
  };

  const { tableData, loading: isTableLoading } = useTableData({
    name: 'decision',
    endpoint: () =>
      api.getDecisions({
        page,
        pageSize,
      }),
    mapData: (list: Request[]) => list?.map((item) => mapTableData(item)),
    dependencyArray: [page, pageSize],
    enabled: !isFormLoading,
  });

  if (isFormLoading || isTableLoading) return <FullscreenLoader />;

  return (
    <TableWrapper title={'Valstybinės veterinarinės kontrolės subjektų sprendimai'}>
      <TableButtonsRow></TableButtonsRow>
      <Table
        loading={isTableLoading}
        notFoundInfo={{ text: 'Nėra sukurtų prašymų', onClick: () => {} }}
        data={tableData}
        columns={animalDecisionColumns}
        onClick={(item: any) => {
          navigate(slugs.decision(item.id));
        }}
        showPageSizeDropdown={true}
      />
    </TableWrapper>
  );
};

export default AnimalRequestsDecisions;

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
