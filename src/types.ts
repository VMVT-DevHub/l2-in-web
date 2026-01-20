import { HistoryTypes, StatusTypes } from './utils/constants';

export interface User {
  id?: string;
  firstName?: string;
  role?: any;
  aob?: string;
  address?: string;
  fullName?: string;
  lastName?: string;
  email?: string;
  type?: any;
  phone?: string;
  profiles?: any[];
  companyCode: string;
  companyName: string;
  activeOrgCode: string;
  roles: {
    orgs: {
      id: string;
      roles: string[];
      orgName: string;
    }[];
  };
}

export interface DelegatedUsers {
  roles: string[];
  userId: string;
  userName: string;
}

export interface FormHistory {
  type: HistoryTypes;
  comment: string;
  createdBy: User;
  createdAt: Date;
}
export interface FormErrors {
  firstName?: string;
  lastName?: string;
  personalCode?: string;
}

export interface Form {
  id: number;
  form: string;
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

export type ProfileId = 'freelancer' | number;
