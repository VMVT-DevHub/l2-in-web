import DragAndDropUploadField from './DragAndDropUploadField';
import { ControlProps, resolveData } from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';
import api from '../utils/api';
import { fileUploadErrors } from '../utils/text';
import { formatError } from '../utils/functions';

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
  const text = uischema?.options?.text;
  const availableMimeTypes = uischema?.options?.availableMimeTypes;
  const availableExtensionsTypes = uischema?.options?.availableExtensionsTypes;
  const maxFileSizeMB = uischema?.options?.maxFileSizeMB;
  const isMulti = uischema?.options?.multi;

  const { requestId = '' } = useParams();

  if (!visible) return null;

  const handleDownloadFile = async (file: any) => {
    try {
      const url = await api.getSharePointDownloadUrl(file.sharepointFileId || file.id);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to get download URL');
    }
  };

  const handleUploadFile = async (files: File[]) => {
    try {
      const uploadedFiles = await api.uploadFiles(files, requestId);

      if (isMulti) {
        handleChange(path, [...(inputData || []), ...uploadedFiles]);
      } else {
        handleChange(path, uploadedFiles[0] || null);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleCreateFile = async (files: File[]) => {
    try {
      const uploadedFiles = await api.createFiles(files, requestId);
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
      handleChange(path, undefined);
    }
  };

  const displayData = isMulti ? inputData || [] : inputData ? [inputData] : [];

  return (
    <DragAndDropUploadField
      label={label}
      error={formatError(errors)}
      showError={true}
      disabled={!enabled}
      onUpload={handleCreateFile}
      handleError={(type) => {
        toast.error(fileUploadErrors[type], {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
        });
      }}
      files={displayData}
      multiple={isMulti}
      onDelete={handleDeleteFile}
      onDownload={handleDownloadFile}
      customDeleteIcon={
        <IconContainer>
          <StyledIcon name={IconName.deleteItem} />
        </IconContainer>
      }
      text={text}
      availableMimeTypes={availableMimeTypes}
      availableExtensionsTypes={availableExtensionsTypes}
      maxFileSizeMB={maxFileSizeMB}
    />
  );
};

const StyledIcon = styled(Icon)``;

const IconContainer = styled.div`
  margin: auto 0 11px 0px;
  display: flex;
  cursor: pointer;
`;
