import { Button, Table } from '@aplinkosministerija/design-system';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import FullscreenLoader from '../components/FullscreenLoader';

import { useState } from 'react';
import FormSelectModal from '../components/FormSelectModal';
import StatusTag from '../components/StatusTag';
import TableWrapper from '../components/TableWrapper';
import { Request } from '../types';
import api from '../utils/api';
import { colorsByStatus } from '../utils/constants';
import { handleError } from '../utils/functions';
import { useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { requestStatusLabels } from '../utils/text';

const labels = {
  no: { show: true, label: 'Prašymo Nr.' },
  formTitle: { show: true, label: 'Rūšis' },
  productNames: { show: true, label: 'Produkto pavadinimas' },
  importingCountry: { show: true, label: 'Šalis importuotoja' },
  productAmount: { show: true, label: 'Kiekis' },
  status: { show: true, label: 'Statusas' },
};

const Certificates = () => {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const { page } = params;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading: isFormLoading } = useQuery(['forms'], () => api.getTableForm(), {
    onError: handleError,
    refetchOnWindowFocus: false,
  });

  const { tableData, loading: isTableLoading } = useTableData({
    name: 'requests',
    endpoint: () => api.getRequests({ query: {} }),
    mapData: (list: Request[]) => list.map((item) => mapTableData(item)),
    dependencyArray: [searchParams, page],
    enabled: !isFormLoading,
  });
  const mapTableData = (item) => {
    return {
      id: item.id,
      no: `#${item.id}`,
      form: item?.form,
      formTitle: item?.formConfig?.title,
      productNames: item?.productNames?.join(', '),
      importingCountry: item?.importingCountry,
      productAmount: item?.productAmount,
      status: renderStatusTag(item.status),
    };
  };

  const renderStatusTag = (status) =>
    status && <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />;

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
        columns={labels}
        onClick={(item: any) => {
          navigate(slugs.certificate(item.form, item.id));
        }}
      />
      <FormSelectModal
        title="Naujas sertifikato prašymas"
        onClick={(form) => {
          navigate(slugs.certificate(form, 'naujas'));
        }}
        onClose={() => setShowModal(false)}
        isVisible={showModal}
        forms={data?.forms}
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
