import Certificates from '../Pages/Certificates';
import Form from '../Pages/Form';
import FoodRequests from '../Pages/FoodRequests';
import AnimalRequests from '../Pages/AnimalRequests';

export const slugs = {
  certificates: `/sertifikatai`,
  certificate: (form: string, requestId: string) => `/sertifikatai/${form}/${requestId}`,

  foodRequests: `/maisto-tvarkymas`,
  foodRequest: (form: string, requestId: string) => `/maisto-tvarkymas/${form}/${requestId}`,

  animalRequests: `/veterinarines-kontroles-objektai`,
  animalRequest: (form: string, requestId: string) =>
    `/veterinarines-kontroles-objektai/${form}/${requestId}`,

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
  {
    title: 'Prašymai veterinarinės kontrolės objektams',
    slug: slugs.animalRequests,
    component: <AnimalRequests />,
    sidebar: true,
  },
  {
    slug: slugs.animalRequest(':form', ':requestId'),
    component: <Form formType={'animal'} />,
  },
];
