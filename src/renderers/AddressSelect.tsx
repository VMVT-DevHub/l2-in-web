import { AsyncSelectField } from '@aplinkosministerija/design-system';
import api from '../utils/api';
import styled from 'styled-components';
import { ControlProps } from '@jsonforms/core';
import { useContext, useEffect, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useQuery } from '@tanstack/react-query';

export interface AddressValue {
  gyvId?: number;
  gyvName?: string;
  adrId?: number;
  adrName?: string;
}

interface AddressPickerProps {
  label?: string;
  bottomLabel?: string;
  error?: string;
  showError?: boolean;
  disabled?: boolean;
  value?: AddressValue;
  onChange: (value?: AddressValue) => void;
}

interface AddressSearchItem {
  id: number;
  pavad: string;
  vietove: string;
  tipas: string;
}

type Option = {
  id: number;
  name: string;
};

const formatLabel = (item?: AddressSearchItem): string =>
  item ? `${item.pavad}${item.vietove ? `, ${item.vietove}` : ''}` : '';

const normalizeAddressValue = (value: any): AddressValue | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const normalized: AddressValue = {};
  if (value.gyvId != null) normalized.gyvId = value.gyvId;
  if (value.gyvName != null) normalized.gyvName = value.gyvName;
  if (value.adrId != null) normalized.adrId = value.adrId;
  if (value.adrName != null) normalized.adrName = value.adrName;
  return Object.keys(normalized).length ? normalized : undefined;
};

export const AddressSelect = (props: ControlProps) => {
  const { user } = useContext<UserContextType>(UserContext);
  const ctx: JsonFormsStateContext = useJsonForms();
  const { path, enabled, handleChange, data, errors } = props;
  const current = normalizeAddressValue(data);
  const cleanError =
    (typeof errors === 'string' && errors.length > 1 && errors.split('\n')[1]) || undefined;
  const hasAOB = !!user?.aob;
  const addressError = current?.gyvId && !current?.adrId ? 'Adresas yra privalomas.' : cleanError;
  const isUsingAOB = hasAOB && user.aob && current?.adrId == null;
  const regNo = ctx?.core?.data?.veiklaviete?.['registracijos-nr'] || '';
  const isEditForm = (props?.schema as any)['x-edit'];

  const { data: decisionData } = useQuery({
    queryKey: ['decisionAdr', regNo, isEditForm],
    queryFn: () => api.getDecisionRegNo(regNo),
    enabled: !!isEditForm && regNo.length > 3,
  });

  //
  useEffect(() => {
    if (!isEditForm || !decisionData) return;
    handleChange(path, {
      gyvId: decisionData?.kodai?.gyv,
      gyvName: decisionData?.vietove,
      adrId: decisionData?.kodai?.aob,
      adrName: decisionData?.pavad,
    });
  }, [decisionData]);

  const updateValue = (next?: AddressValue) => {
    if (!next || next.gyvId == null) {
      handleChange(path, undefined);
      return;
    }

    const value: AddressValue = {
      gyvId: next.gyvId,
      gyvName: next.gyvName,
    };

    if (next.adrId != null) {
      value.adrId = next.adrId;
    }
    if (next.adrName != null) {
      value.adrName = next.adrName;
    }

    handleChange(path, value);
  };

  function debounce<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: any[]) =>
      new Promise((resolve, reject) => {
        clearTimeout(timer);
        timer = setTimeout(
          () =>
            fn(...args)
              .then(resolve)
              .catch(reject),
          delay,
        );
      })) as T;
  }

  const loadGyv = debounce(async (input: string) => {
    if (input.trim().length < 2) return { items: [] };
    const res = await api.getGyv(input.trim());
    return {
      items: res.map((item: AddressSearchItem) => ({
        id: item.id,
        name: formatLabel(item),
      })),
    };
  }, 300);

  const loadAdr = debounce(async (input: string) => {
    if (!current?.gyvId || input.trim().length < 2) return { items: [] };
    const res = await api.getAdr(current.gyvId, input.trim());
    return {
      items: res.map((item: AddressSearchItem) => ({
        id: item.id,
        name: formatLabel(item),
      })),
    };
  }, 300);
  //temp

  return (
    <FieldWrapper>
      {/* GYV SELECT */}
      <StyledAsyncSelectField
        name="gyvenviete"
        label="Gyvenvietė *"
        error={cleanError}
        placeholder="Pradėkite vesti"
        disabled={!enabled}
        value={current?.gyvId ? { id: current.gyvId, name: current.gyvName ?? '' } : undefined}
        getOptionLabel={(o: Option) => o.name}
        optionsKey="items"
        loadOptions={loadGyv}
        onChange={(option?: Option) => {
          if (!option) {
            updateValue(undefined);
            return;
          }

          updateValue({
            gyvId: option.id,
            gyvName: option.name,
          });
        }}
      />

      {/* ADR SELECT */}
      <StyledAsyncSelectField
        name="adresas"
        label="Adresas *"
        error={addressError}
        disabled={!enabled || !current?.gyvId}
        value={
          isUsingAOB
            ? { id: user.aob, name: user.address ?? '' }
            : current?.adrId
            ? { id: current.adrId, name: current.adrName ?? '' }
            : undefined
        }
        getOptionLabel={(o: Option) => o.name}
        optionsKey="items"
        loadOptions={loadAdr}
        onChange={(option?: Option) => {
          if (!option) {
            updateValue(undefined);
            return;
          }

          if (!current?.gyvId) {
            updateValue(undefined);
            return;
          }

          updateValue({
            gyvId: current.gyvId,
            gyvName: current.gyvName,
            adrId: option.id,
            adrName: option.name,
          });
        }}
      />
    </FieldWrapper>
  );
};

const StyledAsyncSelectField = styled(AsyncSelectField)`
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 6px;
`;
