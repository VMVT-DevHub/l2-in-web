import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { routes, slugs } from '../utils/routes';
import Avatar from './Avatar';
import Icon, { IconName } from './Icons';
import Logo from './Logo';
import { UserContext, UserContextType } from './UserProvider';

const showDecisionButton = import.meta.env.VITE_SHOW_ALL_REQUESTS === 'true';

interface ModuleMenuProps {
  className?: string;
}

const SideBar = ({ className }: ModuleMenuProps) => {
  const { user, logout } = useContext<UserContextType>(UserContext);
  const currentLocation = useLocation();
  const hasProfiles = false;
  const [chosenJAName, setChosenJAName] = useState('');
  const [currentTab, setCurrentTab] = useState('prasymai');
  const navigate = useNavigate();

  useEffect(() => {
    const foundOrg = user?.roles.orgs.find((org) => org.id === user.activeOrgCode);
    setChosenJAName(foundOrg?.orgName || '');
  }, [user]);

  if (currentLocation.pathname.includes(slugs.selectOrg)) {
    return (
      <Header className={className}>
        <TitleContainer>
          <LogoContainer
            onClick={() => {
              navigate('/');
            }}
          >
            <StyledLogo isWhite={true} />
            <p>VMVT e. portalas</p>
          </LogoContainer>
        </TitleContainer>
        <BottomRow>
          {hasProfiles ? (
            <></>
          ) : (
            <ContentContainer>
              <ProfileRow>
                <InnerRow>
                  <NameInfo>
                    <Avatar name={user?.firstName || ''} surname={user?.lastName || ''} />
                    <FullName>{`${user?.firstName} ${user?.lastName}`}</FullName>
                  </NameInfo>
                  <UserInfo>
                    <Email>{user?.email}</Email>
                    {user?.companyCode ? (
                      <JAinfo>{`${user.companyName ? user?.companyName : ''} ${
                        user?.companyCode
                      } `}</JAinfo>
                    ) : user?.activeOrgCode ? (
                      <>
                        <Email>atstovauja </Email>
                        <JAinfo>{` ${chosenJAName} ${user?.activeOrgCode}`}</JAinfo>
                      </>
                    ) : (
                      ''
                    )}
                  </UserInfo>
                </InnerRow>

                <LogOut
                  onClick={() => {
                    logout();
                  }}
                >
                  <StyledLogoutIcon name={IconName.logout} />
                </LogOut>
              </ProfileRow>
              {user?.companyCode && <StyledLink to="/sertifikatai">Grįžti atgal</StyledLink>}
            </ContentContainer>
          )}
        </BottomRow>
      </Header>
    );
  }

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
    <Header className={className}>
      <div>
        <TitleContainer>
          <LogoContainer onClick={() => navigate('/')}>
            <StyledLogo isWhite={true} />
            <p>VMVT e. portalas</p>
          </LogoContainer>
          <TitleRow>
            <StyledButton
              $isCurrent={currentTab == 'prasymai'}
              onClick={() => setCurrentTab('prasymai')}
            >
              Prašymai
            </StyledButton>
            {showDecisionButton && (
              <StyledButton
                $isCurrent={currentTab == 'sprendimai'}
                onClick={() => setCurrentTab('sprendimai')}
              >
                Sprendimai
              </StyledButton>
            )}
          </TitleRow>
        </TitleContainer>

        <Column>{renderTabs(currentTab)}</Column>
      </div>
      <BottomRow>
        {hasProfiles ? (
          <></>
        ) : (
          <ContentContainer>
            <ProfileRow>
              <InnerRow>
                <NameInfo>
                  <Avatar name={user?.firstName || ''} surname={user?.lastName || ''} />
                  <FullName>{`${user?.firstName} ${user?.lastName}`}</FullName>
                </NameInfo>
                <UserInfo>
                  <Email>{user?.email}</Email>
                  {user?.companyCode ? (
                    <JAinfo>{`${user.companyName ? user?.companyName : ''} ${
                      user?.companyCode
                    } `}</JAinfo>
                  ) : user?.activeOrgCode ? (
                    <>
                      <Email>atstovauja </Email>
                      <JAinfo>{` ${chosenJAName} ${user?.activeOrgCode}`}</JAinfo>
                    </>
                  ) : (
                    ''
                  )}
                </UserInfo>
              </InnerRow>
              <LogOut
                onClick={() => {
                  logout();
                }}
              >
                <StyledLogoutIcon name={IconName.logout} />
              </LogOut>
            </ProfileRow>
            {user?.companyCode && <StyledLink to="/organizacija">Deleguoti asmenis</StyledLink>}
          </ContentContainer>
        )}
      </BottomRow>
    </Header>
  );
};

export default SideBar;

const LogOut = styled.div`
  align-self: flex-end;
`;

const NameInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  color: #89aad2;
  font-weight: 600;
  align-items: center;
  padding-bottom: 28px;
  & p {
    margin: 22px 0 0 10px;
  }
  cursor: pointer;
`;

const StyledLogo = styled(Logo)`
  padding: 16px 0 0 16px;
  width: 50px;
`;

const TitleContainer = styled.div`
  background-color: #1254a4;
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: end;
  align-items: end;
`;

const StyledTabLink = styled(Link)`
  color: white;
  &:hover {
  }
`;
const StyledLink = styled(Link)`
  color: white;
  max-width: 350px;
  padding-left: 9px;
  &:hover {
    text-decoration: underline;
  }
`;

export const Column = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  background-color: '#FFFFFF1F';
  padding: 18px 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 0;
  width: 300px;
  background-color: ${({ theme }) => theme.colors.primary};
  height: 100%;
`;

const StyledLogoutIcon = styled(Icon)`
  color: rgb(255, 255, 255, 0.64);
  font-size: 2.5rem;
`;

const UserInfo = styled.div`
  margin: 8px 20px 0 8px;
`;

const JAinfo = styled.div`
  font-size: 1.4rem;
  margin-top: 8px;
  max-width: 170px;
  font-weight: bold;
  color: #f7f8fa;
`;

const FullName = styled.div`
  font-size: 1.7rem;
  max-width: 150px;
  font-weight: bold;
  color: #f7f8fa;
`;

const Email = styled.div`
  font-size: 1.2rem;
  margin-top: 4px;
  color: rgb(255, 255, 255, 0.64);
`;

const InnerRow = styled.div`
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
  padding: 18px 16px;
  background-color: #1254a4;
`;

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
`;

const Tab = styled.div<{ isActive: boolean }>`
  padding: 9px;
  color: #f7f8fa;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ isActive }) => isActive && '#FFFFFF1F'};
  display: flex;
  justify-content: space-between;
  &:hover {
    background: #ffffff1f 0% 0% no-repeat padding-box;
  }
`;
