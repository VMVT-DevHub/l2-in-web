// src/renderers/Components.tsx
import {
  and,
  formatIs,
  isArrayObjectControl,
  isBooleanControl,
  isDateControl,
  isDateTimeControl,
  isEnumControl,
  isIntegerControl,
  isNumberControl,
  isNumberFormatControl,
  isObjectControl,
  isPrimitiveArrayControl,
  isStringControl,
  isTimeControl,
  optionIs,
  or,
  rankWith,
  scopeEndsWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsArrayLayoutProps, withJsonFormsControlProps } from '@jsonforms/react';
import { ArrayLayout } from './ArrayLayout';
import { CustomAthFieldRenderer } from './AuthField';
import { BoundariesSelect } from './BoundarySelect';
import { AddressSelect } from './AddressSelect';
import { ButtonGroupRenderer } from './ButtonGroup';
import { ButtonMultiSelectRerender } from './ButtonMultiSelect';
import { CategorizationLayout } from './CategorizationLayout';
import { CategoryLayout } from './CategoryLayout';
import { CheckBoxRenderer } from './Checkbox';
import { CombinedInput } from './CombinedInput';
import { CountryFieldRenderer } from './CountryField';
import CreatableMultiSelectRerender from './CreatableMultiSelect';
import { DateRenderer } from './DateField';
import { DateTimeRenderer } from './DateTimeField';
import { EmailFieldRenderer } from './EmailField';
import { FormCategorizationLayout } from './FormCategorizationLayout';
import { GroupLayout } from './GroupLayout';
import { GroupTimelineLayout } from './GroupTimelineLayout';
import { HorizontalLayout } from './HorizontalLayout';
import ModalArrayLayout from './ModalArrayLayout';
import { MultiTreeSelectFieldRenderer } from './MultiTreeSelectFieldRenderer';
import { CustomNumberRenderer } from './NumberField';
import PrimitiveArrayLayout from './PrimitiveArrayLayout';
import { SelectFieldRenderer } from './SelectField';
import { TextareaRenderer } from './Textarea';
import { CustomTextRenderer } from './TextInput';
import { TimeRenderer } from './TimeField';
import { TimelineCountryEndRenderer } from './TimelineCountryEnd';
import { TimelineCountryStartRenderer } from './TimelineCountryStart';
import { TimelineCountryStepRenderer } from './TimelineCountryStep';
import { TreeSelectFieldRenderer } from './TreeSelectField';
import { UploadRenderer } from './Upload';
import { MultiSelect } from './MultiSelect';
import { PlainTextRenderer } from './PlainText';
import { RadioRenderer } from './Radio';

export const customRenderers = [
  { tester: rankWith(2, isStringControl), renderer: withJsonFormsControlProps(CustomTextRenderer) },
  {
    tester: rankWith(3, and(isStringControl, optionIs('display', 'textarea'))),
    renderer: withJsonFormsControlProps(TextareaRenderer),
  },
  {
    tester: rankWith(10, and(isStringControl, formatIs('url'))),
    renderer: withJsonFormsControlProps(EmailFieldRenderer),
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
    tester: rankWith(9, isDateTimeControl),
    renderer: withJsonFormsControlProps(DateTimeRenderer),
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
    tester: rankWith(3, or(isEnumControl, optionIs('display', 'customEnum'))),
    renderer: withJsonFormsControlProps(SelectFieldRenderer),
  },
  {
    tester: rankWith(5, and(isEnumControl, optionIs('display', 'radio'))),
    renderer: withJsonFormsControlProps(RadioRenderer),
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
    tester: rankWith(4, and(isEnumControl, optionIs('display', 'treeSelect'))),
    renderer: withJsonFormsControlProps(TreeSelectFieldRenderer),
  },
  {
    tester: rankWith(4, and(isObjectControl, optionIs('display', 'treeSelect'))),
    renderer: withJsonFormsControlProps(TreeSelectFieldRenderer),
  },
  {
    tester: rankWith(4, and(isPrimitiveArrayControl, optionIs('display', 'multiTreeSelect'))),
    renderer: withJsonFormsControlProps(MultiTreeSelectFieldRenderer),
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
    tester: rankWith(6, and(uiTypeIs('Categorization'), optionIs('display', 'form'))),
    renderer: withJsonFormsControlProps(FormCategorizationLayout),
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
    tester: rankWith(15, and(isStringControl, optionIs('display', 'PlainText'))),
    renderer: withJsonFormsControlProps(PlainTextRenderer),
  },
  {
    tester: rankWith(2, isArrayObjectControl),
    renderer: withJsonFormsArrayLayoutProps(ArrayLayout),
  },
  {
    tester: rankWith(3, and(isArrayObjectControl, optionIs('display', 'modal'))),
    renderer: withJsonFormsArrayLayoutProps(ModalArrayLayout),
  },
  {
    tester: rankWith(3, and(isArrayObjectControl, optionIs('display', 'upload'))),
    renderer: withJsonFormsControlProps(UploadRenderer),
  },
  {
    tester: rankWith(1, isPrimitiveArrayControl),
    renderer: withJsonFormsArrayLayoutProps(PrimitiveArrayLayout),
  },

  {
    tester: rankWith(2, and(isPrimitiveArrayControl, optionIs('display', 'creatableMultiSelect'))),
    renderer: withJsonFormsArrayLayoutProps(CreatableMultiSelectRerender),
  },
  {
    tester: rankWith(2, and(isPrimitiveArrayControl, optionIs('display', 'multiSelect'))),
    renderer: withJsonFormsArrayLayoutProps(MultiSelect),
  },
  {
    tester: rankWith(2, and(isPrimitiveArrayControl, optionIs('display', 'buttonMultiSelect'))),
    renderer: withJsonFormsArrayLayoutProps(ButtonMultiSelectRerender),
  },
  {
    tester: rankWith(10, and(isNumberControl, optionIs('display', 'boundariesSelect'))),
    renderer: withJsonFormsControlProps(BoundariesSelect),
  },
  {
    tester: rankWith(10, and(scopeEndsWith('gyv'), optionIs('display', 'addressSelect'))),
    renderer: withJsonFormsControlProps(AddressSelect),
  },
];
