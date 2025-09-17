import { useContext, useEffect } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import styled from 'styled-components';
import { device } from '@aplinkosministerija/design-system';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { slugs } from '../utils/routes';

const JAselection = () => {
  const { user } = useContext<UserContextType>(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.activeOrgCode !== null) {
      navigate('/sertifikatai');
    }
  }, []);

  const JAOptions = user?.roles.orgs;

  const { mutateAsync: updateCurrentOrg } = useMutation(
    (org: string) => api.updateCurrentOrg({ orgCode: org }),
    {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: (request) => {
        queryClient.invalidateQueries(['user']);
        navigate('/sertifikatai');
      },
      retry: false,
    },
  );

  return (
    <OuterContainer>
      <PopupContainer width="600px">
        <Title>Pasirinkite atstovaujamą asmenį</Title>
        {user?.companyCode ? (
          <OrgContainer onClick={() => navigate('/sertifikatai')}>
            Pildysiu kaip Juridinis Asmuo
          </OrgContainer>
        ) : (
          <OrgContainer onClick={() => navigate('/sertifikatai')}>
            Noriu pildyti kaip Fizinis Asmuo
          </OrgContainer>
        )}
        {JAOptions?.map((org) => (
          <OrgContainer key={org.id} onClick={() => updateCurrentOrg(org.id.toString())}>
            {org.orgName}, ID: {org.id}
          </OrgContainer>
        ))}
      </PopupContainer>
    </OuterContainer>
  );
};
const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const OrgContainer = styled.button`
  padding: 8px;
  margin: 8px;
  border: 1px solid #2671d9;
  font-size: 1.6rem;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #2671d91f;
  }
`;

const PopupContainer = styled.div<{ width?: string }>`
  background-color: white;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  width: ${({ width }) => width || 'auto'};
  padding: 28px 44px;

  @media ${device.mobileL} {
    min-width: 100%;
    min-height: 100%;
    border-radius: 0px;
  }
`;

const Title = styled.h2``;
const PopUpContainer = styled.div`
  padding: 16px;
`;

export default JAselection;
