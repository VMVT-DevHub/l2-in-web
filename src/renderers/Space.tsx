import { withJsonFormsLayoutProps } from '@jsonforms/react';

export const SpaceRenderer = ({ uischema }) => {
  if (Object.keys(uischema).length === 0) {
    // Render empty space
    return <div />;
  }
  return null;
};
