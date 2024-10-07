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
import CreatableMultiSelectRerender from './CreatableMultiSelect';
import { DateRenderer } from './DateField';
import { GroupLayout } from './GroupLayout';
import { HorizontalLayout } from './HorizontalLayout';
import { CustomNumberRenderer } from './NumberField';
import { SelectFieldRenderer } from './SelectField';
import { TextareaRenderer } from './Textarea';
import { CustomTextRenderer } from './TextInput';
import { TimeRenderer } from './TimeField';
import { TreeFieldRenderer } from './TreeField';
import { UploadRenderer } from './Upload';

export const customRenderers = [
  { tester: rankWith(2, isStringControl), renderer: withJsonFormsControlProps(CustomTextRenderer) },
  {
    tester: rankWith(3, and(isStringControl, optionIs('display', 'textarea'))),
    renderer: withJsonFormsControlProps(TextareaRenderer),
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
    tester: rankWith(3, and(isArrayObjectControl, optionIs('display', 'upload'))),
    renderer: withJsonFormsControlProps(UploadRenderer),
  },
  {
    tester: rankWith(2, and(isPrimitiveArrayControl, optionIs('display', 'creatableMultiSelect'))),
    renderer: withJsonFormsArrayLayoutProps(CreatableMultiSelectRerender),
  },
];
