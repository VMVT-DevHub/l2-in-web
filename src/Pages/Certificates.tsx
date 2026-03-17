import { Button, SortedColumnsProps, Table } from '@aplinkosministerija/design-system';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import FormSelectModal from '../components/FormSelectModal';
import FullscreenLoader from '../components/FullscreenLoader';
import StatusTag from '../components/StatusTag';
import TableWrapper from '../components/TableWrapper';
import { Request } from '../types';
import api from '../utils/api';
import { certificateColumns } from '../utils/columns';
import { colorsByStatus, SortFields } from '../utils/constants';
import { handleError } from '../utils/functions';
import { useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { requestStatusLabels } from '../utils/text';

const Certificates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);

  const { page, pageSize } = params;

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState<string[]>([SortFields.CREATED_AT]);

  const [draft, setDraft] = useState({
    requestId: params.requestId ?? '',
    importer: params.importer ?? '',
    manufacturerName: params.manufacturerName ?? '',
    kpnCode: params.kpnCode ?? '',
    productName: params.productName ?? '',
  });

  useEffect(() => {
    setDraft({
      requestId: params.requestId ?? '',
      importer: params.importer ?? '',
      manufacturerName: params.manufacturerName ?? '',
      kpnCode: params.kpnCode ?? '',
      productName: params.productName ?? '',
    });
  }, [
    params.requestId,
    params.importer,
    params.manufacturerName,
    params.kpnCode,
    params.productName,
  ]);

  const sortingFields = {
    no: 'id',
    formTitle: 'form',
    date: 'createdAt',
    status: 'status',
    productNames: 'productNames',
    animalNames: 'animalNames',
    importingCountry: 'importCountry',
    productAmount: 'importAmount',
  };

  const applyFilters = () => {
    const sp = new URLSearchParams(searchParams);

    const requestId = draft.requestId.trim();
    const importer = draft.importer.trim();
    const manufacturerName = draft.manufacturerName.trim();
    const kpnCode = draft.kpnCode.trim();
    const productName = draft.productName.trim();

    if (requestId) sp.set('requestId', requestId);
    else sp.delete('requestId');

    if (importer) sp.set('importer', importer);
    else sp.delete('importer');

    if (manufacturerName) sp.set('manufacturerName', manufacturerName);
    else sp.delete('manufacturerName');

    if (kpnCode) sp.set('kpnCode', kpnCode);
    else sp.delete('kpnCode');

    if (productName) sp.set('productName', productName);
    else sp.delete('productName');

    sp.set('page', '1');
    setSearchParams(sp);
  };

  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams);

    sp.delete('requestId');
    sp.delete('importer');
    sp.delete('manufacturerName');
    sp.delete('kpnCode');
    sp.delete('productName');
    sp.set('page', '1');

    setSearchParams(sp);

    setDraft({
      requestId: '',
      importer: '',
      manufacturerName: '',
      kpnCode: '',
      productName: '',
    });
  };

  const anyFilter =
    !!(params.requestId ?? '').trim() ||
    !!(params.importer ?? '').trim() ||
    !!(params.manufacturerName ?? '').trim() ||
    !!(params.kpnCode ?? '').trim() ||
    !!(params.productName ?? '').trim();

  const onEnterApply = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') applyFilters();
  };

  const { data, isLoading: isFormLoading } = useQuery(
    ['certificates'],
    () => api.getCertificateForm(),
    {
      onError: handleError,
      refetchOnWindowFocus: false,
    },
  );

  const renderStatusTag = (status: any) =>
    status && <StatusTag label={requestStatusLabels[status]} color={colorsByStatus[status]} />;

  const mapTableData = (item: any) => {
    let truncatedProductNames = item?.productNames?.join?.(', ')?.slice?.(0, 50) ?? '';
    let truncatedAnimalNames = item?.animalNames?.join?.(', ')?.slice?.(0, 50) ?? '';

    truncatedProductNames += truncatedProductNames.length >= 50 ? '...' : '';
    truncatedAnimalNames += truncatedAnimalNames.length >= 50 ? '...' : '';

    return {
      id: item.id,
      no: `#${item.id}`,
      form: item?.form,
      formTitle: item?.formConfig?.title,
      date: format(item.createdAt, 'yyyy MM dd'),
      productNames: truncatedProductNames || truncatedAnimalNames,
      importingCountry: item?.importingCountry,
      productAmount: item?.productAmount?.join?.(', '),
      status: renderStatusTag(item.status),
    };
  };

  const { tableData, loading: isTableLoading } = useTableData({
    name: 'certificateRequests',
    endpoint: () =>
      api.getCertificateRequests({
        query: {
          requestId: params.requestId,
          importer: params.importer,
          manufacturerName: params.manufacturerName,
          kpnCode: params.kpnCode,
          productName: params.productName,
        },
        page,
        pageSize,
        sort,
      }),
    mapData: (list: Request[]) => list.map((item) => mapTableData(item)),
    dependencyArray: [
      page,
      pageSize,
      sort,
      params.requestId,
      params.importer,
      params.manufacturerName,
      params.kpnCode,
      params.productName,
    ],
    enabled: !isFormLoading,
  });

  const handleSorting = ({ direction, sortBy = ['id'] }: SortedColumnsProps) => {
    const prefix = direction === 'desc' ? '-' : '';
    setSort([`${prefix}${sortingFields[sortBy[0]]}`]);
  };

  if (isFormLoading || isTableLoading) return <FullscreenLoader />;

  return (
    <TableWrapper title={'Sertifikatai'}>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <SearchInput
            placeholder="Prašymo ID"
            inputMode="numeric"
            value={draft.requestId}
            onChange={(e) => setDraft((d) => ({ ...d, requestId: e.target.value }))}
            onKeyDown={onEnterApply}
          />
          <SearchInput
            placeholder="Importuotojas"
            value={draft.importer}
            onChange={(e) => setDraft((d) => ({ ...d, importer: e.target.value }))}
            onKeyDown={onEnterApply}
          />
          <SearchInput
            placeholder="Gamintojas"
            value={draft.manufacturerName}
            onChange={(e) => setDraft((d) => ({ ...d, manufacturerName: e.target.value }))}
            onKeyDown={onEnterApply}
          />
          <SearchInput
            placeholder="KPN kodas"
            inputMode="numeric"
            value={draft.kpnCode}
            onChange={(e) => setDraft((d) => ({ ...d, kpnCode: e.target.value }))}
            onKeyDown={onEnterApply}
          />
          <SearchInput
            placeholder="Pavadinimas (teksto dalis)"
            value={draft.productName}
            onChange={(e) => setDraft((d) => ({ ...d, productName: e.target.value }))}
            onKeyDown={onEnterApply}
          />

          <ApplyButton type="button" onClick={applyFilters}>
            Ieškoti
          </ApplyButton>

          <ClearButton type="button" disabled={!anyFilter} onClick={clearFilters}>
            Išvalyti
          </ClearButton>
        </TableButtonsInnerRow>

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
        onColumnSort={handleSorting}
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
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  height: 40px;
  min-width: 160px;
  padding: 0 12px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #98a2b3;
  }
`;

const ApplyButton = styled.button`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #98a2b3;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f2f4f7;
  }
`;

const ClearButton = styled.button`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d0d5dd;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f2f4f7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
