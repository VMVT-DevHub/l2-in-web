import AnimalRequests from '../Pages/AnimalRequests';
import AnimalRequestsDecisions from '../Pages/AnimalRequestsDecisions';
import Certificates from '../Pages/Certificates';
import Decisions from '../Pages/Decisions';
import FoodRequests from '../Pages/FoodRequests';
import Form from '../Pages/Form';
import JAselection from '../Pages/JAselection';

const showAllRequests = import.meta.env.VITE_SHOW_ALL_REQUESTS === 'true';

export const slugs = {
  selectOrg: '/organizacija',
  certificates: `/sertifikatai`,
  decisions: `/sprendimai`,
  certificateRequest: (form: string, requestId: string) => `/sertifikatai/${form}/${requestId}`,

  foodRequests: `/maisto-tvarkymas`,
  foodRequest: (form: string, requestId: string) => `/maisto-tvarkymas/${form}/${requestId}`,

  animalRequests: `/veterinarines-kontroles-objektai`,
  animalRequest: (form: string, requestId: string) =>
    `/veterinarines-kontroles-objektai/${form}/${requestId}`,

  profile: '/profilis',
  cantLogin: '/negalima-jungtis',
  login: '/prisijungimas',

  decision: (type: string, decisionId: string) => `/sprendimai/${type}/${decisionId}`,
};

export const routes = [
  {
    title: 'Eksporto sertifikatai',
    slug: slugs.certificates,
    component: <Certificates />,
    sidebar: true,
  },
  {
    slug: slugs.selectOrg,
    component: <JAselection />,
  },
  {
    slug: slugs.certificateRequest(':form', ':requestId'),
    component: <Form formType={'certificate'} copyEnabled={true} />,
  },
  ...(showAllRequests
    ? [
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
          component: <Form formType={'animal'} copyEnabled={true} />,
        },
        {
          title: 'Veterinarinės kontrolės objektų sprendimai',
          slug: slugs.decisions,
          component: <AnimalRequestsDecisions />,
          decisions: true,
        },
        {
          slug: slugs.decision(':type', ':decisionId'),
          component: <Decisions />,
        },
      ]
    : []),
];
