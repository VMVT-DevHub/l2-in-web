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
  const [currentTab, setCurrentTab] = useState('prasymai');

  const handleNavigate = (slug: string) => {
    navigate(slug);
    setShowMenu(false);
  };

  const renderTabs = (currentTab: string) => {
    return (routes || [])
      .filter((route) => (currentTab == 'prasymai' ? route.sidebar : route.decisions))
      .map((route, index) => {
        const isActive = currentLocation.pathname.includes(route.slug);

        return (
          <StyledTabLink to={route.slug} key={`${index}-route`}>
            <Tab isActive={isActive}>{route.title}</Tab>
          </StyledTabLink>
        );
      });
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
          <SecondRow>
            <StyledLogo isWhite={true} />
            <TitleRow>
              <StyledButton
                $isCurrent={currentTab == 'prasymai'}
                onClick={() => setCurrentTab('prasymai')}
              >
                Prašymai
              </StyledButton>
              <StyledButton
                $isCurrent={currentTab == 'sprendimai'}
                onClick={() => setCurrentTab('sprendimai')}
              >
                Sprendimai
              </StyledButton>
            </TitleRow>
            <div onClick={() => setShowMenu(false)}>
              <ExitIcon name={IconName.close} />
            </div>
          </SecondRow>
          <Column>{renderTabs(currentTab)}</Column>
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

export const Column = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.primary};
  height: 100%;
  padding: 48px 16px 0 16px;
`;

const StyledTabLink = styled(Link)`
  color: white;
`;

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
`;

const StyledButton = styled.button<{ $isCurrent: boolean }>`
  font-weight: 600;
  width: 50%;
  padding: 9px;
  color: #f7f8fa;
  color: ${({ $isCurrent }) => ($isCurrent ? '#f7f8fa' : 'rgba(255,255,255,.5)')};
  font-size: 1.7rem;
  cursor: pointer;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  background: ${({ $isCurrent, theme }) => ($isCurrent ? theme.colors.primary : '0')};
  &:hover {
    color: ${({ $isCurrent }) => ($isCurrent ? '#f7f8fa' : '#f7f8fa')};
  }
`;

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

  padding: 18px 24px;
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
  gap: 16px;
  background-color: #1254a4;
  padding: 18px 24px 20px 24px;
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
  background-color: #1254a4;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 5;
  overflow-y: auto;
`;

const StyledLogo = styled(Logo)`
  div {
    color: #231f20;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
  vertical-align: middle;
  color: #231f20;
`;

export default MobileNavbar;
