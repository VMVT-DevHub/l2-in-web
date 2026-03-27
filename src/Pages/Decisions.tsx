import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import TableWrapper from '../components/TableWrapper';
import BackButton from '../components/BackButton';
import styled from 'styled-components';
import Group from '../components/Group';
import GroupParagraph from '../components/GroupParagraph';
import { paragraphs } from '../utils/text';
import { format, formatDate } from 'date-fns';
import { formatDateAndTime } from '../utils/format';

const Decisions = () => {
  const { type = '1', decisionId = '' } = useParams();
  const { status, data, error } = useQuery({
    queryKey: ['detailedDecision'],
    queryFn: () => api.getDetailedDecision(decisionId),
  });
  // const decision
  //nenaudojam type is params, naudojam spren_prasymo_pavad_id!!
  const titles = {
    1: 'Administracinis sprendimas dėl veterinarinės kontrolės objekto patvirtinimo / registravimo',
    2: 'Administracinis sprendimas dėl veterinarinės kontrolės objekto panaikinimo / sustabdymo / sustabdymo panaikinimo',
    3: 'Administracinis sprendimas dėl veterinarinės kontrolės objekto panaikinimo / sustabdymo / sustabdymo panaikinimo',
    4: 'Administracinis sprendimas dėl veterinarinės kontrolės objekto duomenų keitimo',
  };

  if (status == 'loading') return <Loader />;
  console.log(data);
  console.log(error);

  return (
    <DecisionsContainer>
      <BackButton />
      <Title>{titles[type]}</Title>
      <Group
        title={'Dokumento duomenys'}
        questions={['Prašymo pateikimo data', 'Prašymo numeris', 'Prašymo pavadinimas']}
        answers={['-', data?.reqId || '-', data?.decision?.title || '-']}
      />
      <Group
        title={'Ūkio subjekto duomenys'}
        questions={[
          'Vardas, pavardė / Juridinio asmens pavadinimas',
          'Veiklavietės pavadinimas',
          'Veiklavietės adresas',
          'Veiklos pavadinimas',
        ]}
        answers={[
          '-',
          data?.action?.placeTitle || '-',
          data?.action?.address || '-',
          data?.action?.title || '-',
        ]}
      />
      <Group
        title={'Administracinio sprendimo duomenys'}
        questions={[
          'Dokumento data',
          'Dokumento numeris',
          type == '1' ? 'Suteiktas patvirtinimo / registravimo numeris' : '',
        ]}
        answers={[
          data?.decision?.date ? format(new Date(data.decision.date), 'yyyy-MM-dd') : '-',
          data?.decision?.docNo || '-',
          type == '1' ? data?.decision?.regNo || '-' : '',
        ]}
      />
      <GroupParagraph
        title={'Motyvuotas atsisakymas'}
        display={type == '2' && (data?.result?.id == 1 || data?.result?.id == 2)}
        text={'Trūksta'}
      />
      <GroupParagraph
        title={'Administracinio sprendimo teisinis pagrindas'}
        text={data?.result?.id == 3 ? 'Trūksta' : paragraphs.legalBasis}
      />
      <GroupParagraph title={'Apskundimo tvarka'} text={paragraphs.complaintInfo} />
      <Group
        title={'VMVT darbuotojų duomenys'}
        questions={[
          'Darbuotojo (parengusio sprendimą) vardas pavardė',
          'Darbuotojo (parengusio sprendimą) padalinys',
          'Sprendimą priėmusio darbuotojo (vadovo) vardas pavardė',
          'Sprendimą priėmusio darbuotojo (vadovo) padalinys',
        ]}
        answers={[
          data?.creator?.name || '-',
          data?.creator?.department || '-',
          data?.decider?.name || '-',
          data?.decider?.department || '-',
        ]}
      />
    </DecisionsContainer>
  );
};

export default Decisions;

const DecisionsContainer = styled.div`
  margin: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 26px;
  letter-spacing: 0px;
  color: #231f20;
  margin-right: 16px;
`;
