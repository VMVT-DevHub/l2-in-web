import { HistoryTypes, StatusTypes } from './utils/constants';

export interface User {
  id?: string;
  firstName?: string;
  role?: any;
  fullName?: string;
  lastName?: string;
  email?: string;
  type?: any;
  phone?: string;
  profiles?: any[];
}

export interface FormHistory {
  type: HistoryTypes;
  comment: string;
  createdBy: User;
  createdAt: Date;
}

export interface Form {
  id: number;
  name: string;
  schema: any;
  uiSchema: any;
  displayData: {
    tableColumns: { label: string; path: string; mapper: string }[];
    addNewLabel: string;
  };
}

export interface Request {
  id: number;
  status: StatusTypes;
  canEdit: boolean;
  form: Form;
  tenant: any;
  data: any;
}
