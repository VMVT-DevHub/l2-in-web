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
import { CategorizationLayout } from './Categorization';
import { CategoryLayout } from './CategoryLayout';
import { CheckBoxRenderer } from './Checkbox';
import { CombinedInput } from './CombinedInput';
import CreatableMultiSelectRerender from './CreatableMultiSelect';
import { DateRenderer } from './DateField';
import { EnumRenderer } from './EnumField';
import { GroupLayout } from './GroupLayout';
import { HorizontalLayout } from './HorizontalLayout';
import { CustomNumberRenderer } from './NumberField';
import { SpaceRenderer } from './Space';
import { TextareaRenderer } from './Textarea';
import { CustomTextRenderer } from './TextInput';
import { TimeRenderer } from './TimeField';
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
    tester: rankWith(100, isEnumControl),
    renderer: withJsonFormsControlProps(EnumRenderer),
  },
  {
    tester: rankWith(5, uiTypeIs('Categorization')),
    renderer: withJsonFormsControlProps(CategorizationLayout),
  },

  {
    tester: rankWith(200, uiTypeIs('Group')),
    renderer: withJsonFormsControlProps(GroupLayout),
  },
  {
    tester: rankWith(200, uiTypeIs('HorizontalLayout')),
    renderer: withJsonFormsControlProps(HorizontalLayout),
  },
  {
    tester: rankWith(200, and(isObjectControl, optionIs('display', 'combinedInput'))),
    renderer: withJsonFormsControlProps(CombinedInput),
  },
  {
    tester: rankWith(200, and(isObjectControl, optionIs('display', 'upload'))),
    renderer: withJsonFormsControlProps(UploadRenderer),
  },
  {
    tester: rankWith(200, uiTypeIs('Textarea')),
    renderer: withJsonFormsControlProps(TextareaRenderer),
  },
  {
    tester: rankWith(200, isArrayObjectControl),
    renderer: withJsonFormsArrayLayoutProps(ArrayLayout),
  },
  {
    tester: rankWith(201, and(isArrayObjectControl, optionIs('display', 'upload'))),
    renderer: withJsonFormsControlProps(UploadRenderer),
  },
  {
    tester: rankWith(
      200,
      and(isPrimitiveArrayControl, optionIs('display', 'creatableMultiSelect')),
    ),
    renderer: withJsonFormsArrayLayoutProps(CreatableMultiSelectRerender),
  },
  { tester: () => 1, renderer: withJsonFormsArrayLayoutProps(SpaceRenderer) },
];
