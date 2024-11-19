import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { Form, Request, User } from '../types';

const cookies = new Cookies();

interface GetAll {
  resource: string;
  page?: number | string;
  populate?: string[];
  filter?: string | any;
  query?: string | any;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: any;
  fields?: string[];
  id?: string;
  geom?: any;
  [key: string]: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number | string;
  pageSize: number;
  error?: any;
}

interface GetOne {
  resource: string;
  id?: string | any;
  populate?: string[];
  scope?: string;
  [key: string]: any;
}
interface UpdateOne {
  resource?: string;
  id?: string | number;
  params?: any;
}

interface Delete {
  resource: string;
  id: string;
}

interface Create {
  resource: string;
  params?: any;
  id?: string;
}

class Api {
  private AuthApiAxios: AxiosInstance;

  constructor() {
    this.AuthApiAxios = Axios.create();

    this.AuthApiAxios.interceptors.request.use(
      (config) => {
        if (!config.url) {
          return config;
        }
        const token = cookies.get('token');
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token;
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const { data } = await endpoint();

    return data;
  };

  get = async <T>({ resource, id, ...rest }: GetAll): Promise<GetAllResponse<T> | any> => {
    const config = {
      params: {
        ...rest,
        page: rest.page || 1,
        pageSize: rest.pageSize || 10,
      },
    };
    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/api/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getAll = async ({ resource, id, ...rest }: GetAll) => {
    const config = {
      params: rest,
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/api/${resource}${id ? `/${id}` : ''}/all`, config),
    );
  };

  getOne = async ({ resource, id, populate, scope, ...rest }: GetOne) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!scope && { scope }),
        ...rest,
      },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/api/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  update = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`/api/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() => this.AuthApiAxios.delete(`/api/${resource}/${id}`));
  };

  create = async ({ resource, id, params }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`/api/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  getUserInfo = async (): Promise<User> => {
    return this.errorWrapper(() => this.AuthApiAxios.get('/api/auth/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.AuthApiAxios.post('/api/auth/cancel'));
  };

  post = async ({ resource, params = {} }: Create) => {
    return this.errorWrapper(() => this.AuthApiAxios.post(`/api/${resource}`, params));
  };

  eGatesSign = async () => {
    return this.post({
      resource: 'auth/sign',
      params: { appHost: window.origin },
    });
  };

  eGatesLogin = async (params: any) => {
    return this.post({
      resource: 'auth/login',
      params,
    });
  };

  getUi = async () => {
    return this.get({ resource: 'forms/goods/ui' });
  };

  getSchema = async () => {
    return this.get({ resource: 'forms/goods/schema' });
  };

  getForms = async () => {
    return this.getAll({ resource: 'forms', fields: ['id', 'name'] });
  };

  getEsCountries = async () => {
    return this.get({ resource: 'countries/es' });
  };

  getForm = async ({ id }: { id: any }) => {
    return this.get({ resource: `forms/${id}` });
  };

  getTableForm = async (): Promise<any> => {
    return this.get({ resource: `formTypes/certificate` });
  };

  getFoodForm = async (): Promise<any> => {
    return this.get({ resource: `formTypes/food` });
  };

  getAnimalForm = async (): Promise<any> => {
    return this.get({ resource: `formTypes/animal` });
  };

  getFormSchema = async ({ formType, form }: { formType: any; form: any }): Promise<Form> => {
    return this.get({
      resource: `formTypes/${formType}/${form}`,
    });
  };

  getRequests = async ({ query }: { query: any }): Promise<GetAllResponse<Request>> => {
    return await this.get({
      resource: 'reports/certificate',
      query,
    });
  };
  getFoodRequests = async ({ query }: { query: any }): Promise<GetAllResponse<Request>> => {
    return await this.get({
      resource: 'reports/food',
      query,
    });
  };
  getAnimalRequests = async ({ query }: { query: any }): Promise<GetAllResponse<Request>> => {
    return await this.get({
      resource: 'reports/animal',
      query,
    });
  };

  getRequestHistory = async ({ page, pageSize, id }: any) =>
    await this.get({
      resource: `requests/${id}/history`,
      page,
      pageSize,
    });

  getRequest = async ({ id }: { id: string }): Promise<Request> => {
    return await this.get({
      resource: 'requests',
      populate: ['canEdit'],
      id,
    });
  };

  createRequest = async (params: any): Promise<Form> => {
    return await this.post({
      resource: 'requests',
      params,
    });
  };

  updateRequest = async (id: string, params: any): Promise<Form> => {
    return await this.update({
      resource: 'requests',
      params,
      id,
    });
  };

  deleteRequest = async (id: string): Promise<Form> => {
    return await this.delete({
      resource: 'requests',
      id,
    });
  };

  uploadFiles = async (files: File[] = []): Promise<any> => {
    if (!files.length) return [];

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    try {
      const data = await Promise.all(
        files?.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const { data } = await this.AuthApiAxios.post(`/api/sharePoint/upload`, formData, config);
          return data;
        }),
      );

      return data.flat();
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  };

  submitForm = async ({ data }) => {
    return this.post({ resource: 'forms/goods/submit', params: { data } });
  };

  getOptions = async ({ path, page, input }) => {
    return this.get({
      resource: path,
      page,
      search: input,
    });
  };
}

export default new Api();
