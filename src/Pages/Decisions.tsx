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
import { useContext } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import { Button } from '@aplinkosministerija/design-system';
import { toast } from 'react-toastify';

const Decisions = () => {
  const { decisionId = '' } = useParams();
  const { user } = useContext<UserContextType>(UserContext);

  const userName = `${user?.firstName} ${user?.lastName}`;

  const { status, data, error } = useQuery({
    queryKey: ['detailedDecision'],
    queryFn: () => api.getDetailedDecision(decisionId),
  });
  const type = data?.decision?.titleId || 0;
  const variant = data?.type?.id || 0;
  const showDownloadButton = data?.status?.id == 3 || data?.status?.id == 4; //show only when Suteikta or Atmesta

  const titles = {
    0: 'Administracinis sprendimas dėl veterinarinės kontrolės subjekto',
    1: 'Administracinis sprendimas dėl veterinarinės kontrolės subjekto patvirtinimo / registravimo',
    2: 'Administracinis sprendimas dėl veterinarinės kontrolės subjekto panaikinimo / sustabdymo',
    3: 'Administracinis sprendimas dėl veterinarinės kontrolės subjekto sustabdymo panaikinimo',
    4: 'Administracinis sprendimas dėl veterinarinės kontrolės subjekto duomenų keitimo',
    5: 'Administracinis sprendimas dėl veterinarinės kontrolės subjekto atsisakymo patvirtinti / registruoti',
  };

  if (status == 'loading') return <Loader />;

  const handleDownloadFile = async (fileId: any) => {
    try {
      const url = await api.getSharePointDecisionDownloadUrl(fileId, 'vet');
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Nepavyko atsisiųsti. Pabandykite vėliau');
    }
  };

  return (
    <DecisionsContainer>
      <BackButton />
      <Title>{variant == 3 ? titles[5] : titles[type]}</Title>
      {showDownloadButton && (
        <ButtonContainer>
          <Button
            onClick={() => {
              handleDownloadFile(data?.vksId);
            }}
          >
            {'Atsisiųsti'}
          </Button>
        </ButtonContainer>
      )}

      <Group
        title={'Prašymo, kurį išnagrinėjus priimtas šis administracinis sprendimas, duomenys'}
        questions={['Prašymo pateikimo data', 'Prašymo numeris', 'Prašymo pavadinimas']}
        answers={[
          (data?.reqDate && format(new Date(data.reqDate), 'yyyy-MM-dd')) || '-',
          data?.reqId || '-',
          data?.decision?.title || '-',
        ]}
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
          data?.parent?.title || userName,
          data?.action?.placeTitle || '-',
          data?.action?.address || '-',
          data?.action?.title || '-',
        ]}
      />
      <Group
        title={type == 1 ? 'Administracinio sprendimo duomenys' : 'Duomenys apie prašymą'}
        questions={[
          'Dokumento data',
          'Dokumento numeris',
          variant == 1 || variant == 2 ? 'Suteiktas patvirtinimo / registravimo numeris' : '',
          type == 2 || type == 3 || type == 4 ? 'Patvirtinimo / Registravimo numeris' : '',
          type == 2 || type == 3 ? 'Veiksmas' : '',
          type == 2 || type == 3 ? 'Terminas iki' : '',
          type == 4 ? 'Duomenų keitimo tipas' : '',
        ]}
        answers={[
          data?.decision?.date ? format(new Date(data.decision.date), 'yyyy-MM-dd') : '-',
          data?.decision?.docNo || '-',
          variant == 1 || variant == 2 ? data?.decision?.regNo || '-' : '',
          type == 2 || type == 3 || type == 4 ? '-' : '',
          type == 2 || type == 3 ? '-' : '',
          type == 2 || type == 3 ? '-' : '',
          type == 4 ? '-' : '',
        ]}
      />
      <GroupParagraph
        title={'Administracinio sprendimo teisinis pagrindas'}
        text={
          type == 1 && (variant == 1 || variant == 2) ? paragraphs.legalBasis : data?.legal || '-'
        }
      />
      <GroupParagraph
        title={'Motyvuotas atsisakymas'}
        display={type == 1 && variant == 3}
        text={data?.refusal || '-'}
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
          data?.users?.decider || '-',
          data?.users?.deciderDep || '-',
          data?.users?.manager || '-',
          data?.users?.managerDep || '-',
        ]}
      />
    </DecisionsContainer>
  );
};

export default Decisions;

const ButtonContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: end;
`;

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
