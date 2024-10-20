// src/renderers/Components.tsx
import {
  and,
  isArrayObjectControl,
  isBooleanControl,
  isDateControl,
  isEnumControl,
  isIntegerControl,
  isNumberControl,
  isNumberFormatControl,
  isObjectControl,
  isPrimitiveArrayControl,
  isStringControl,
  isTimeControl,
  optionIs,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsArrayLayoutProps, withJsonFormsControlProps } from '@jsonforms/react';
import { ArrayLayout } from './ArrayLayout';
import { ButtonGroupRenderer } from './ButtonGroup';
import { CategorizationLayout } from './Categorization';
import { CategoryLayout } from './CategoryLayout';
import { CheckBoxRenderer } from './Checkbox';
import { CombinedInput } from './CombinedInput';
import { CountryFieldRenderer } from './CountryField';
import CreatableMultiSelectRerender from './CreatableMultiSelect';
import { DateRenderer } from './DateField';
import { GroupLayout } from './GroupLayout';
import { GroupTimelineLayout } from './GroupTimelineLayout';
import { HorizontalLayout } from './HorizontalLayout';
import { CustomNumberRenderer } from './NumberField';
import { SelectFieldRenderer } from './SelectField';
import { TextareaRenderer } from './Textarea';
import { CustomTextRenderer } from './TextInput';
import { TimeRenderer } from './TimeField';
import { TimelineCountryEndRenderer } from './TimelineCountryEnd';
import { TimelineCountryStartRenderer } from './TimelineCountryStart';
import { TimelineCountryStepRenderer } from './TimelineCountryStep';
import { TreeFieldRenderer } from './TreeField';
import { UploadRenderer } from './Upload';
import { ButtonMultiSelectRerender } from './ButtonMultiSelect';
import { AddMoreLayout } from './AddMoreLayout';
import { BoundariesSelect } from './BoundarySelect';
import { CustomAthFieldRenderer } from './AuthField';

function BoundariesSelectRerender() {}

export const customRenderers = [
  { tester: rankWith(2, isStringControl), renderer: withJsonFormsControlProps(CustomTextRenderer) },
  {
    tester: rankWith(3, and(isStringControl, optionIs('display', 'textarea'))),
    renderer: withJsonFormsControlProps(TextareaRenderer),
  },
  {
    tester: rankWith(4, and(isStringControl, optionIs('display', 'authField'))),
    renderer: withJsonFormsControlProps(CustomAthFieldRenderer),
  },
  { tester: rankWith(5, isBooleanControl), renderer: withJsonFormsControlProps(CheckBoxRenderer) },
  {
    tester: rankWith(9, isDateControl),
    renderer: withJsonFormsControlProps(DateRenderer),
  },
  {
    tester: rankWith(9, uiTypeIs('Category')),
    renderer: withJsonFormsControlProps(CategoryLayout),
  },

  {
    tester: rankWith(9, isTimeControl),
    renderer: withJsonFormsControlProps(TimeRenderer),
  },
  {
    tester: rankWith(9, isNumberControl),
    renderer: withJsonFormsControlProps(CustomNumberRenderer),
  },
  {
    tester: rankWith(9, isNumberFormatControl),
    renderer: withJsonFormsControlProps(CustomNumberRenderer),
  },
  {
    tester: rankWith(8, isIntegerControl),
    renderer: withJsonFormsControlProps(CustomNumberRenderer),
  },

  {
    tester: rankWith(3, isEnumControl),
    renderer: withJsonFormsControlProps(SelectFieldRenderer),
  },

  {
    tester: rankWith(4, and(isEnumControl, optionIs('display', 'countrySelect'))),
    renderer: withJsonFormsControlProps(CountryFieldRenderer),
  },
  {
    tester: rankWith(5, and(isEnumControl, optionIs('display', 'timelineCountryStart'))),
    renderer: withJsonFormsControlProps(TimelineCountryStartRenderer),
  },
  {
    tester: rankWith(5, and(isEnumControl, optionIs('display', 'timelineCountryStep'))),
    renderer: withJsonFormsControlProps(TimelineCountryStepRenderer),
  },
  {
    tester: rankWith(5, and(isEnumControl, optionIs('display', 'timelineCountryEnd'))),
    renderer: withJsonFormsControlProps(TimelineCountryEndRenderer),
  },

  {
    tester: rankWith(4, and(isEnumControl, optionIs('display', 'tree'))),
    renderer: withJsonFormsControlProps(TreeFieldRenderer),
  },
  {
    tester: rankWith(4, and(isEnumControl, optionIs('display', 'buttonGroup'))),
    renderer: withJsonFormsControlProps(ButtonGroupRenderer),
  },
  {
    tester: rankWith(5, uiTypeIs('Categorization')),
    renderer: withJsonFormsControlProps(CategorizationLayout),
  },

  {
    tester: rankWith(2, uiTypeIs('Group')),
    renderer: withJsonFormsControlProps(GroupLayout),
  },
  {
    tester: rankWith(3, and(uiTypeIs('Group'), optionIs('display', 'timeline'))),
    renderer: withJsonFormsControlProps(GroupTimelineLayout),
  },
  {
    tester: rankWith(2, uiTypeIs('HorizontalLayout')),
    renderer: withJsonFormsControlProps(HorizontalLayout),
  },
  {
    tester: rankWith(2, and(isObjectControl, optionIs('display', 'combinedInput'))),
    renderer: withJsonFormsControlProps(CombinedInput),
  },
  {
    tester: rankWith(2, and(isObjectControl, optionIs('display', 'upload'))),
    renderer: withJsonFormsControlProps(UploadRenderer),
  },
  {
    tester: rankWith(2, uiTypeIs('Textarea')),
    renderer: withJsonFormsControlProps(TextareaRenderer),
  },
  {
    tester: rankWith(2, isArrayObjectControl),
    renderer: withJsonFormsArrayLayoutProps(ArrayLayout),
  },
  {
    tester: rankWith(6, and(isArrayObjectControl, optionIs('display', 'addMore'))),
    renderer: withJsonFormsControlProps(AddMoreLayout),
  },
  {
    tester: rankWith(6, and(isPrimitiveArrayControl, optionIs('display', 'addMore'))),
    renderer: withJsonFormsControlProps(AddMoreLayout),
  },
  {
    tester: rankWith(3, and(isArrayObjectControl, optionIs('display', 'upload'))),
    renderer: withJsonFormsControlProps(UploadRenderer),
  },

  {
    tester: rankWith(2, and(isPrimitiveArrayControl, optionIs('display', 'creatableMultiSelect'))),
    renderer: withJsonFormsArrayLayoutProps(CreatableMultiSelectRerender),
  },
  {
    tester: rankWith(2, and(isPrimitiveArrayControl, optionIs('display', 'buttonMultiSelect'))),
    renderer: withJsonFormsArrayLayoutProps(ButtonMultiSelectRerender),
  },
  {
    tester: rankWith(10, and(isNumberControl, optionIs('display', 'boundariesSelect'))),
    renderer: withJsonFormsControlProps(BoundariesSelect),
  },
];
