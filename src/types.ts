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
  ak?: string;
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

export interface CoordDetails {
  type: 'coords';
  coordX: string;
  coordY: string;
}

export interface AddressDetails {
  type: 'address';
  apygarda: string;
  id: number;

  kodai: {
    adm: number;
    sav: number;
    gyv: number;
    gat: number;
    aob: number;
    apg: number;
  };

  lks: [number, number];

  nr: string;
  pavad: string;
  post: string;
  regData: string;

  tipas: string;
  vietove: string;

  wgs: [number, number];
}

export interface Decisions {
  id?: number;
  type?: {
    id?: number;
    title?: string;
  };
  status?: {
    id?: number;
    title?: string;
  };
  subType?: {
    id?: number;
    title?: string;
  };
  action?: {
    id?: number;
    title?: string;
    placeTitle?: string;
    address?: string;
    adrAob?: string;
    adrSwg?: string;
  };
  parent?: {
    id?: number;
    title?: string;
    parentRegNo?: string;
  };
  decision?: {
    title?: string;
    titleId?: number;
    date?: Date;
    docNo?: string;
    regNo?: string;
  };
  users?: {
    decider: string;
    deciderDep: string;
    manager: string;
    managerDep: string;
  };
  reqId?: number;
  vksId?: number;
  reqDate?: Date;
  refusal?: string;
  legal?: string;
  createdAt?: Date;
  updatedAt?: Date;
  modifUser?: string;
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

export type DecisionAddressResponse = AddressDetails | CoordDetails;

export type ProfileId = 'freelancer' | number;
