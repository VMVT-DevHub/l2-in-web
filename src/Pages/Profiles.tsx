import { useContext, useState } from 'react';
import styled from 'styled-components';
import FullscreenLoader from '../components/FullscreenLoader';
import Icon from '../components/Icons';
import ProfileCard from '../components/ProfileCard';
import { UserContext, UserContextType } from '../components/UserProvider';
import { ProfileId } from '../types';
import { handleSelectProfile } from '../utils/functions';

const Profiles = () => {
  const { user, logout } = useContext<UserContextType>(UserContext);
  const [loading, setLoading] = useState(false);

  const handleSelect = (profileId: ProfileId) => {
    setLoading(true);
    handleSelectProfile(profileId);
  };

  if (loading) return <FullscreenLoader />;

  return (
    <Container>
      <Title>Pasirinkite paskyrą</Title>
      <InnerContainer>
        {user?.profiles?.map((profile) => (
          <div key={profile?.id} onClick={() => handleSelect(profile.id)}>
            <ProfileCard name={profile.name} email={profile.email || user.email || '-'} />
          </div>
        ))}
        <Row onClick={() => logout()}>
          <Icon name="exit" />
          <BackButton>Atsijungti</BackButton>
        </Row>
      </InnerContainer>
    </Container>
  );
};

export default Profiles;

const Container = styled.div``;

const BackButton = styled.div`
  font-size: 1.4rem;
  color: #121926;
  margin-left: 11px;
`;

const Row = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`;

const Title = styled.div`
  font-size: 1.8rem;
  line-height: 22px;
  font-weight: bold;
  color: #121926;
  margin-bottom: 16px;
`;
