import AnimalRequests from '../Pages/AnimalRequests';
import Certificates from '../Pages/Certificates';
import FoodRequests from '../Pages/FoodRequests';
import Form from '../Pages/Form';

export const slugs = {
  certificates: `/sertifikatai`,
  certificateRequest: (form: string, requestId: string) => `/sertifikatai/${form}/${requestId}`,

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
    slug: slugs.certificateRequest(':form', ':requestId'),
    component: <Form formType={'certificate'} copyEnabled={true} />,
  },
  {
    title: 'Maisto tvarkymo subjektų prašymai',
    slug: slugs.foodRequests,
    component: <FoodRequests />,
    sidebar: true,
  },
  {
    slug: slugs.foodRequest(':form', ':requestId'),
    component: <Form formType={'food'} copyEnabled={false} />,
  },
  {
    title: 'Veterinarinės kontrolės objektų prašymai',
    slug: slugs.animalRequests,
    component: <AnimalRequests />,
    sidebar: true,
  },
  {
    slug: slugs.animalRequest(':form', ':requestId'),
    component: <Form formType={'animal'} copyEnabled={false} />,
  },
];
