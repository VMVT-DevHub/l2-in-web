import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from '../utils/routes';
import Avatar from './Avatar';
import Icon, { IconName } from './Icons';
import Logo from './Logo';
import { UserContext, UserContextType } from './UserProvider';

interface MobileHeaderInterface {
  className?: string;
}

const MobileNavbar = ({ className }: MobileHeaderInterface) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { user, logout } = useContext<UserContextType>(UserContext);

  const handleNavigate = (slug: string) => {
    navigate(slug);
    setShowMenu(false);
  };

  return (
    <>
      {!showMenu ? (
        <Header className={className}>
          <StyledLogo />
          <div onClick={() => setShowMenu(true)}>
            <StyledIcon name={IconName.burger} />
          </div>
        </Header>
      ) : (
        <Container>
          <div>
            <SecondRow>
              <Logo isWhite={true} />
              <div onClick={() => setShowMenu(false)}>
                <ExitIcon name={IconName.close} />
              </div>
            </SecondRow>
            {(routes || [])
              .filter((route) => route.sidebar)
              .map((route, index) => {
                const isActive = currentLocation.pathname.includes(route.slug);
                return (
                  <Tab
                    isActive={isActive}
                    onClick={() => handleNavigate(route.slug)}
                    key={`tab-${index}`}
                  >
                    {route.title}
                  </Tab>
                );
              })}
          </div>
          <BottomRow>
            <ProfileRow>
              <Link to={'/profilis'}>
                <InnerRow>
                  <Avatar name={user?.firstName || ''} surname={user?.lastName || ''} />
                  <UserInfo>
                    <FullName>{`${user?.firstName} ${user?.lastName}`}</FullName>
                    <Email>{user?.email}</Email>
                  </UserInfo>
                </InnerRow>
              </Link>
              <div onClick={() => logout()}>
                <StyledLogoutIcon name={IconName.logout} />
              </div>
            </ProfileRow>
          </BottomRow>
        </Container>
      )}
    </>
  );
};

const UserInfo = styled.div`
  margin: 0 20px 0 8px;
`;

const FullName = styled.div`
  font-size: 1.4rem;
  max-width: 110px;
  font-weight: bold;
  color: #f7f8fa;
`;

const Email = styled.div`
  font-size: 1.2rem;
  color: rgb(255, 255, 255, 0.64);
`;

const StyledLogoutIcon = styled(Icon)`
  color: rgb(255, 255, 255, 0.64);
  font-size: 2.5rem;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Tab = styled.div<{ isActive: boolean }>`
  padding: 10px 8px;
  margin: 0 -8px;
  color: #121926;
  border-radius: 4px;
  color: #f7f8fa;
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ isActive }) => isActive && '#EEEBE561'};
  &:hover {
    background-color: #eeebe561;
  }
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 30px;
  gap: 8px;
`;

const SecondRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 57px;
`;

const ExitIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
  vertical-align: middle;
  color: white;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  height: 64px;
  width: 100%;
  padding: 18px 19px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 5;
  padding: 18px 24px;
  overflow-y: auto;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled(Logo)`
  div {
    color: #231f20;
    margin-bottom: 0;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
  vertical-align: middle;
  color: #231f20;
`;

export default MobileNavbar;
