import { Button, SortedColumnsProps, Table } from '@aplinkosministerija/design-system';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { JSX, useEffect, useMemo, useState } from 'react';
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
import { certTypeCheck, handleError, truncateList } from '../utils/functions';
import { useTableData } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { requestStatusLabels } from '../utils/text';
import SelectField from '../renderers/Select';

const Certificates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries([...searchParams]), [searchParams]);

  const { page, pageSize } = params;
  const selectedForm = params.form === 'goods' || params.form === 'animals' ? params.form : '';

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sort, setSort] = useState<string[]>([SortFields.CREATED_AT]);

  const [draft, setDraft] = useState({
    form: selectedForm,
    requestId: params.requestId ?? '',
    importer: params.importer ?? '',
    createdBy: params.createdBy ?? '',
    manufacturerName: params.manufacturerName ?? '',
    kpnCode: params.kpnCode ?? '',
    productName: params.productName ?? '',
    status: params.status ?? '',
  });

  useEffect(() => {
    setDraft({
      form: selectedForm,
      requestId: params.requestId ?? '',
      importer: params.importer ?? '',
      createdBy: params.createdBy ?? '',
      manufacturerName: params.manufacturerName ?? '',
      kpnCode: params.kpnCode ?? '',
      productName: params.productName ?? '',
      status: params.status ?? '',
    });
  }, [
    selectedForm,
    params.requestId,
    params.importer,
    params.createdBy,
    params.manufacturerName,
    params.kpnCode,
    params.productName,
    params.status,
  ]);

  const sortingFields = {
    no: 'id',
    createdBy: 'createdBy',
    date: 'createdAt',
    status: 'status',
    exportCertificateNo: 'exportCertificateNo',
    productNames: 'productNames',
    animalNames: 'animalNames',
    importingCountry: 'importCountry',
    productAmount: 'importAmount',
    certType: 'id',
  };

  const applyFilters = () => {
    const sp = new URLSearchParams(searchParams);

    const form = draft.form.trim();
    const requestId = draft.requestId.trim();
    const importer = draft.importer.trim();
    const createdBy = draft.createdBy.trim();
    const manufacturerName = draft.manufacturerName.trim();
    const kpnCode = draft.kpnCode.trim();
    const status = draft.status.trim();
    const productName = draft.productName.trim();

    if (form) sp.set('form', form);
    else sp.delete('form');

    if (requestId) sp.set('requestId', requestId);
    else sp.delete('requestId');

    if (form && importer) sp.set('importer', importer);
    else sp.delete('importer');

    if (form && createdBy) sp.set('createdBy', createdBy);
    else sp.delete('createdBy');

    if (form && manufacturerName) sp.set('manufacturerName', manufacturerName);
    else sp.delete('manufacturerName');

    if (form && status) sp.set('status', status);
    else sp.delete('status');

    if (form && kpnCode) sp.set('kpnCode', kpnCode);
    else sp.delete('kpnCode');

    if (form && productName) sp.set('productName', productName);
    else sp.delete('productName');

    sp.set('page', '1');
    setSearchParams(sp);
  };

  const clearFilters = () => {
    const sp = new URLSearchParams(searchParams);

    sp.delete('form');
    sp.delete('requestId');
    sp.delete('importer');
    sp.delete('createdBy');
    sp.delete('status');
    sp.delete('manufacturerName');
    sp.delete('kpnCode');
    sp.delete('productName');
    sp.set('page', '1');

    setSearchParams(sp);

    setDraft({
      form: '',
      requestId: '',
      createdBy: '',
      importer: '',
      manufacturerName: '',
      kpnCode: '',
      productName: '',
      status: '',
    });
  };

  const anyFilter =
    !!selectedForm ||
    !!(params.requestId ?? '').trim() ||
    !!(params.importer ?? '').trim() ||
    !!(params.createdBy ?? '').trim() ||
    !!(params.status ?? '').trim() ||
    !!(params.manufacturerName ?? '').trim() ||
    !!(params.kpnCode ?? '').trim() ||
    !!(params.productName ?? '').trim();

  const hasSelectedForm = draft.form === 'goods' || draft.form === 'animals';
  const isGoodsForm = draft.form === 'goods';
  const productNamePlaceholder =
    draft.form === 'animals' ? 'Gyvūno pavadinimas' : 'Pavadinimas (teksto dalis)';

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
  const mapTableData = (item) => {
    const truncatedProductNames = truncateList(item?.productNames);
    const truncatedAnimalNames = truncateList(item?.animalNames);
    const filteredAnimalAmounts = truncateList(item?.animalAmount.join?.(', '));
    const filteredProductAmounts = truncateList(
      item?.productAmount.filter((i) => i.length > 3).join?.(', '),
    );
    console.log(item.createdBy);
    return {
      id: item.id,
      no: `#${item.id}`,
      exportCertificateNo: item?.exportCertificateNo || '',
      form: item?.form,
      createdBy: item?.createdBy,
      date: format(item.createdAt, 'yyyy MM dd'),
      productNames: truncatedProductNames || truncatedAnimalNames,
      importingCountry: item?.importingCountry,
      productAmount: filteredProductAmounts || filteredAnimalAmounts,
      status: renderStatusTag(item.status),
      certType: certTypeCheck(item?.certType),
    };
  };

  const { tableData, loading: isTableLoading } = useTableData({
    name: 'certificateRequests',
    endpoint: () =>
      api.getCertificateRequests({
        query: {
          form: selectedForm || undefined,
          requestId: params.requestId,
          importer: params.importer,
          createdBy: params.createdBy,
          manufacturerName: selectedForm === 'goods' ? params.manufacturerName : undefined,
          kpnCode: params.kpnCode,
          productName: params.productName,
          status: params.status,
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
      selectedForm,
      params.requestId,
      params.importer,
      params.createdBy,
      params.manufacturerName,
      params.kpnCode,
      params.status,
      params.productName,
    ],
    enabled: !isFormLoading,
  });

  const handleSorting = ({ direction, sortBy = ['id'] }: SortedColumnsProps) => {
    const prefix = direction === 'desc' ? '-' : '';
    setSort([`${prefix}${sortingFields[sortBy[0]]}`]);
  };

  if (isFormLoading || isTableLoading) return <FullscreenLoader />;

  const options = [
    { value: 'goods', label: 'Prekių siunta' },
    { value: 'animals', label: 'Gyvūnų siunta' },
  ];

  const statusOptions = [
    { value: 'CREATED', label: 'Pateiktas' },
    { value: 'SUBMITTED', label: 'Pateiktas pakartotinai' },
    { value: 'REVIEW', label: 'Vertinamas' },
    { value: 'RETURNED', label: 'Grąžintas taisymui' },
    { value: 'REJECTED', label: 'Atmestas' },
    { value: 'APPROVED', label: 'Patvirtintas' },
    { value: 'COMPLETED', label: 'Sertifikatas išduotas' },
    { value: 'DRAFT', label: 'Juodraštis' },
  ];

  return (
    <TableWrapper title={'Sertifikatai'}>
      <TableButtonsRow>
        <TableButtonsInnerRow>
          <SelectField
            value={options.find((o) => o.value === draft.form)}
            onChange={(option) =>
              setDraft((d) => ({
                ...d,
                form: option?.value ?? '',
                importer: '',
                createdBy: '',
                manufacturerName: '',
                kpnCode: '',
                productName: '',
                status: '',
              }))
            }
            options={options}
            getOptionLabel={(option) => option.label}
            handleMouseOver={() => {}}
            clearable={true}
            placeholder="Pasirinkite prašymo rūšį"
            inputFontSize="1.4rem"
          />
          <SearchInput
            placeholder="Prašymo Nr."
            inputMode="numeric"
            value={draft.requestId}
            onChange={(e) => setDraft((d) => ({ ...d, requestId: e.target.value }))}
            onKeyDown={onEnterApply}
          />
          {hasSelectedForm && (
            <>
              <SearchInput
                placeholder="Pateikėjas"
                value={draft.createdBy}
                onChange={(e) => setDraft((d) => ({ ...d, createdBy: e.target.value }))}
                onKeyDown={onEnterApply}
              />
              <SearchInput
                placeholder="Importuotojas"
                value={draft.importer}
                onChange={(e) => setDraft((d) => ({ ...d, importer: e.target.value }))}
                onKeyDown={onEnterApply}
              />
              <SelectField
                value={statusOptions.find((o) => o.value === draft.status)}
                onChange={(option) =>
                  setDraft((d) => ({
                    ...d,
                    status: option?.value ?? '',
                  }))
                }
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                handleMouseOver={() => {}}
                clearable={true}
                placeholder="Statusas"
                inputFontSize="1.4rem"
              />
              {isGoodsForm && (
                <SearchInput
                  placeholder="Gamintojas"
                  value={draft.manufacturerName}
                  onChange={(e) => setDraft((d) => ({ ...d, manufacturerName: e.target.value }))}
                  onKeyDown={onEnterApply}
                />
              )}
              <SearchInput
                placeholder="KPN kodas"
                inputMode="numeric"
                value={draft.kpnCode}
                onChange={(e) => setDraft((d) => ({ ...d, kpnCode: e.target.value }))}
                onKeyDown={onEnterApply}
              />
              <SearchInput
                placeholder={productNamePlaceholder}
                value={draft.productName}
                onChange={(e) => setDraft((d) => ({ ...d, productName: e.target.value }))}
                onKeyDown={onEnterApply}
              />
            </>
          )}

          <Button variant={'transparent'} type="button" onClick={applyFilters}>
            Ieškoti
          </Button>

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
  gap: 48px;
  margin: 16px 0 32px 0;
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
  border-radius: 4px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #98a2b3;
  }
`;

const SearchSelect = styled.select`
  height: 40px;
  min-width: 180px;
  padding: 0 12px;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  outline: none;
  background: #ffffff;
  &:focus {
    border-color: #98a2b3;
  }
`;

const ApplyButton = styled.button`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #98a2b3;
  background: #ffffff;
  border-radius: 30px;
  font-size: 1.4rem;
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
  border-radius: 30px;
  font-size: 1.4rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f2f4f7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
