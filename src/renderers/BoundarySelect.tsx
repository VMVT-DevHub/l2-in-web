import { AsyncSelectField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';

import { useJsonForms } from '@jsonforms/react';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import {
  Address,
  addressesGet,
  addressesSearch,
  municipalitiesGet,
  municipalitiesSearch,
  Municipality,
  ResidentialArea,
  residentialAreasGet,
  residentialAreasSearch,
  Room,
  roomsGet,
  roomsSearch,
  Street,
  streetsGet,
  streetsSearch,
} from '../utils/boundaries';
import { formatError, handleClearOnChange, handleSetOnChange } from '../utils/functions';

function getCursor(page: number | string) {
  if (typeof page !== 'string') return;
  return page;
}

type AddressType = Municipality | ResidentialArea | Street | Address | Room;

const boundariesSearch = {
  savivaldybe: municipalitiesSearch,
  miestas: residentialAreasSearch,
  gatve: streetsSearch,
  'namo-nr': addressesSearch,
  'buto-nr': roomsSearch,
};
const boundariesGet = {
  savivaldybe: municipalitiesGet,
  miestas: residentialAreasGet,
  gatve: streetsGet,
  'namo-nr': addressesGet,
  'buto-nr': roomsGet,
};

const filterKeys = {
  savivaldybe: 'municipalities',
  miestas: 'residentialAreas',
  gatve: 'street',
  'namo-nr': 'addresses',
  'buto-nr': 'rooms',
};

const dependsOn = {
  miestas: 'savivaldybe',
  gatve: 'miestas',
  'namo-nr': 'gatve',
  'buto-nr': 'namo-nr',
};

const getFilters = (address: any = {}, input = '', propertyKey) => {
  switch (propertyKey) {
    case 'savivaldybe': {
      return [{ municipalities: { name: { contains: input } } }];
    }
    case 'miestas': {
      const f: any = { residential_areas: { name: { contains: input } } };
      if (address.savivaldybe) {
        f.municipalities = { codes: [address.savivaldybe] };
      }
      return [f];
    }
    case 'gatve': {
      const f: any = { streets: { name: { contains: input } } };
      if (address.miestas) {
        f.residential_areas = { codes: [address.miestas] };
      }
      return [f];
    }
    case 'namo-nr': {
      const f: any = { addresses: { plot_or_building_number: { contains: input || '' } } };
      if (address.gatve) {
        f.streets = { codes: [address.gatve] };
      }
      return [f];
    }
    case 'buto-nr': {
      const f: any = { rooms: { room_number: { contains: input || '' } } };
      if (address['namo-nr']) {
        f.addresses = { codes: [address['namo-nr']] };
      }
      return [f];
    }
  }
};

const sortBy = {
  savivaldybe: 'name',
  miestas: 'name',
  gatve: 'name',
  'namo-nr': 'plot_or_building_number',
  'buto-nr': 'room_number',
};

const getParentData = (path, property, data) => {
  const parentPath = path?.replace(`.${property}`, '');
  return get(data, parentPath);
};

export const BoundariesSelect = (props: ControlProps) => {
  const ctx = useJsonForms();
  const { path, visible, enabled, handleChange, label, data, errors, uischema } = props;
  const { fetchOptionsFromBoundaries } = uischema.options || {};
  const clearOnChange = handleClearOnChange({ uischema, path, handleChange });
  const setOnChange = handleSetOnChange({ uischema, path, handleChange });
  const address = getParentData(path, fetchOptionsFromBoundaries, ctx.core?.data);
  const [value, setValue] = useState<AddressType>();

  useEffect(() => {
    if (data !== value?.code) {
      if (!data) setValue(undefined);
      else
        boundariesGet[fetchOptionsFromBoundaries]?.({ code: data }).then((response) => {
          setValue(response);
        });
    }
  }, [data]);

  if (!visible) return <></>;

  return (
    <AsyncSelectField
      label={label}
      disabled={!enabled}
      value={value}
      error={formatError(errors)}
      showError={true}
      onChange={(option: AddressType) => {
        setValue(option);
        handleChange(path, option?.code);
        clearOnChange();
        setOnChange(option);
      }}
      getOptionLabel={(option) =>
        option?.name || option?.plot_or_building_number || option?.room_number || '-'
      }
      loadOptions={(input, page) => {
        const filters = getFilters(address, input, fetchOptionsFromBoundaries);
        return boundariesSearch[fetchOptionsFromBoundaries]?.({
          sortBy: sortBy[fetchOptionsFromBoundaries],
          cursor: getCursor(page),
          requestBody: {
            filters,
          },
        });
      }}
      name={fetchOptionsFromBoundaries}
      optionsKey="items"
      handleGetNextPageParam={(params) => params.next_page}
    />
  );
};
