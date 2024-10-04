import Certificates from '../Pages/Certificates';
import Form from '../Pages/Form';

export const slugs = {
  certificates: `/sertifikatai`,
  profile: '/profilis',
  certificate: (form: string, requestId: string) => `/sertifikatai/${form}/${requestId}`,
  cantLogin: '/negalima-jungtis',
  login: '/prisijungimas',
};

export const routes = [
  {
    slug: slugs.certificate(':form', ':requestId'),
    component: <Form formType={'certificate'} />,
  },
  {
    title: 'Sertifikatai',
    slug: slugs.certificates,
    component: <Certificates />,
    sidebar: true,
  },
];
