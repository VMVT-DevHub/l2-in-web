import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { routes, slugs } from '../utils/routes';
import Avatar from './Avatar';
import Icon, { IconName } from './Icons';
import Logo from './Logo';
import { UserContext, UserContextType } from './UserProvider';

interface ModuleMenuProps {
  className?: string;
}

const SideBar = ({ className }: ModuleMenuProps) => {
  const { user, logout } = useContext<UserContextType>(UserContext);
  const currentLocation = useLocation();
  const hasProfiles = false;
  let chosenJAName;
  if (user?.roles?.orgs && user.roles.orgs.length > 1) {
    chosenJAName = user.roles.orgs.find((org) => org.id.toString() === user?.activeOrgCode);
  }
  if (currentLocation.pathname.includes(slugs.selectOrg)) {
    return (
      <Header className={className}>
        <div>
          <TitleRow>
            <Logo isWhite={true} />
          </TitleRow>
        </div>
        <BottomRow>
          {hasProfiles ? (
            <></>
          ) : (
            <ContentContainer>
              <ProfileRow>
                <InnerRow>
                  <Avatar name={user?.firstName || ''} surname={user?.lastName || ''} />
                  <UserInfo>
                    <FullName>{`${user?.firstName} ${user?.lastName}`}</FullName>
                    <Email>{user?.email}</Email>
                  </UserInfo>
                </InnerRow>

                <div
                  onClick={() => {
                    logout();
                  }}
                >
                  <StyledLogoutIcon name={IconName.logout} />
                </div>
              </ProfileRow>
              {user?.companyCode && <StyledLink to="/sertifikatai">Grįžti atgal</StyledLink>}
            </ContentContainer>
          )}
        </BottomRow>
      </Header>
    );
  }

  const renderTabs = () => {
    return (routes || [])
      .filter((route) => route.sidebar)
      .map((route, index) => {
        const isActive = currentLocation.pathname.includes(route.slug);

        return (
          <Link to={route.slug} key={`${index}-route`}>
            <Tab isActive={isActive}>{route.title}</Tab>
          </Link>
        );
      });
  };

  return (
    <Header className={className}>
      <div>
        <TitleRow>
          <Logo isWhite={true} />
        </TitleRow>
        <Column>{renderTabs()}</Column>
      </div>
      <BottomRow>
        {hasProfiles ? (
          <></>
        ) : (
          <ContentContainer>
            <ProfileRow>
              <InnerRow>
                <Avatar name={user?.firstName || ''} surname={user?.lastName || ''} />
                <UserInfo>
                  <FullName>{`${user?.firstName} ${user?.lastName}`}</FullName>
                  <Email>{user?.email}</Email>

                  {user?.companyCode ? (
                    <JAinfo>{`${user.companyName ? user?.companyName : ''} ${
                      user?.companyCode
                    } `}</JAinfo>
                  ) : user?.activeOrgCode ? (
                    <>
                      <Email>atstovauja </Email>
                      <JAinfo>{` ${chosenJAName?.orgName ? chosenJAName?.orgName : ''} ${
                        user?.activeOrgCode
                      }`}</JAinfo>
                    </>
                  ) : (
                    ''
                  )}
                </UserInfo>
              </InnerRow>

              <div
                onClick={() => {
                  logout();
                }}
              >
                <StyledLogoutIcon name={IconName.logout} />
              </div>
            </ProfileRow>
            {user?.companyCode && <StyledLink to="/organizacija">Deleguoti asmenis</StyledLink>}
          </ContentContainer>
        )}
      </BottomRow>
    </Header>
  );
};

export default SideBar;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: end;
  align-items: end;
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
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 0;
  width: 300px;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 18px 16px;
  height: 100%;
`;

const StyledLogoutIcon = styled(Icon)`
  color: rgb(255, 255, 255, 0.64);
  font-size: 2.5rem;
`;

const UserInfo = styled.div`
  margin: 0 20px 0 8px;
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

const TitleRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
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
