import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';

export const CategoryLayout = ({ uischema, path, schema, renderers, ...rest }: any) => {
  const layoutProps = {
    elements: uischema.elements,
    direction: 'column',
    ...rest,
  };

  return <MaterialLayoutRenderer {...layoutProps} />;
};
