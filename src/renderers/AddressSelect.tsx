import { AsyncSelectField } from '@aplinkosministerija/design-system';
import api from '../utils/api';
import styled from 'styled-components';
import { ControlProps } from '@jsonforms/core';

export interface AddressValue {
  gyvId: number | null;
  gyvName?: string;
  adrId: number | null;
  adrName?: string;
}

interface AddressPickerProps {
  label?: string;
  bottomLabel?: string;
  error?: string;
  showError?: boolean;
  disabled?: boolean;
  value?: AddressValue;
  onChange: (value: AddressValue) => void;
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

export const AddressSelect = (props: ControlProps) => {
  const { path, visible, enabled, handleChange, label, data, errors, uischema } = props;

  const current: AddressValue = data ?? {
    gyvId: null,
    adrId: null,
  };

  return (
    <FieldWrapper>
      {/* GYV SELECT */}
      <AsyncSelectField
        name="gyvenviete"
        label="Gyvenvietė"
        disabled={!enabled}
        value={current.gyvId ? { id: current.gyvId, name: current.gyvName ?? '' } : undefined}
        getOptionLabel={(o: Option) => o.name}
        optionsKey="items"
        loadOptions={async (input: string) => {
          if (input.trim().length < 2) {
            return { items: [] };
          }

          const res = await api.getGyv(input.trim());

          return {
            items: res.map((item: AddressSearchItem) => ({
              id: item.id,
              name: formatLabel(item),
            })),
          };
        }}
        onChange={(option?: Option) => {
          handleChange(path, {
            gyvId: option?.id ?? null,
            gyvName: option?.name,
            adrId: null,
            adrName: undefined,
          });
        }}
      />

      {/* ADR SELECT */}
      <AsyncSelectField
        name="adresas"
        label="Adresas"
        disabled={!enabled || !current.gyvId}
        value={current.adrId ? { id: current.adrId, name: current.adrName ?? '' } : undefined}
        getOptionLabel={(o: Option) => o.name}
        optionsKey="items"
        loadOptions={async (input: string) => {
          if (!current.gyvId || input.trim().length < 2) {
            return { items: [] };
          }

          const res = await api.getAdr(current.gyvId, input.trim());

          return {
            items: res.map((item: AddressSearchItem) => ({
              id: item.id,
              name: formatLabel(item),
            })),
          };
        }}
        onChange={(option?: Option) => {
          handleChange(path, {
            ...current,
            adrId: option?.id ?? null,
            adrName: option?.name,
          });
        }}
      />
    </FieldWrapper>
  );
};

const FieldWrapper = styled.div``;
