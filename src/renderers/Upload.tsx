import { DragAndDropUploadField } from '@aplinkosministerija/design-system';
import { ControlProps, resolveData } from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../utils/api';

export const UploadRenderer = ({
  handleChange,
  errors,
  path,
  label,
  enabled,
  visible,
  uischema,
}: ControlProps) => {
  const { core } = useJsonForms();
  const inputData = resolveData(core?.data, path) || (uischema?.options?.multi ? [] : null);
  const isMulti = uischema?.options?.multi;

  if (!visible) return null;

  const handleUploadFile = async (files: File[]) => {
    try {
      const uploadedFiles = await api.uploadFiles(files);

      if (isMulti) {
        handleChange(path, [...(inputData || []), ...uploadedFiles]);
      } else {
        handleChange(path, uploadedFiles[0] || null);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleDeleteFile = (files) => {
    if (isMulti && Array.isArray(inputData)) {
      handleChange(path, files);
    } else {
      handleChange(path, null);
    }
  };

  const displayData = isMulti ? inputData || [] : inputData ? [inputData] : [];

  return (
    <DragAndDropUploadField
      error={errors}
      showError={false}
      disabled={!enabled}
      onUpload={handleUploadFile}
      files={displayData}
      multiple={isMulti}
      onDelete={handleDeleteFile}
    />
  );
};
