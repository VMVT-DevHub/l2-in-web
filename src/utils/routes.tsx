import Certificates from '../Pages/Certificates';
import Form from '../Pages/Form';
import FoodRequests from '../Pages/FoodRequests';

export const slugs = {
  certificates: `/sertifikatai`,
  certificate: (form: string, requestId: string) => `/sertifikatai/${form}/${requestId}`,

  foodRequests: `/maisto-tvarkymas`,
  foodRequest: (form: string, requestId: string) => `/maisto-tvarkymas/${form}/${requestId}`,

  profile: '/profilis',
  cantLogin: '/negalima-jungtis',
  login: '/prisijungimas',
};

export const routes = [
  {
    title: 'Sertifikatai',
    slug: slugs.certificates,
    component: <Certificates />,
    sidebar: true,
  },
  {
    slug: slugs.certificate(':form', ':requestId'),
    component: <Form formType={'certificate'} />,
  },
  {
    title: 'Maisto tvarkymo subjektų prašymai',
    slug: slugs.foodRequests,
    component: <FoodRequests />,
    sidebar: true,
  },
  {
    slug: slugs.foodRequest(':form', ':requestId'),
    component: <Form formType={'food'} />,
  },
];
