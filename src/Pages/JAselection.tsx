import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import styled from 'styled-components';
import {
  Button,
  device,
  Modal,
  NumericField,
  NumericTextField,
  Table,
  TextField,
} from '@aplinkosministerija/design-system';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { slugs } from '../utils/routes';
import { ButtonVariants } from '../styles';
import { FormErrors } from '../types';

const JAselection = () => {
  const { user } = useContext<UserContextType>(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const initialValues = { firstName: '', lastName: '', personalCode: '' };
  const isJA = !!user?.companyCode;

  const { mutateAsync: removeDelegatedUsers } = useMutation(
    (uuid: string) => api.removeDelegatedUsers(uuid),
    {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: (request) => {
        queryClient.invalidateQueries(['delegation']);
      },
      retry: false,
    },
  );

  const { mutateAsync: addDelegatedUsers, isPending: isSubmitLoading } = useMutation(
    (values: typeof initialValues) =>
      api.addDelegatedUsers({
        ak: values.personalCode.toString(),
        firstName: values.firstName,
        lastName: values.lastName,
      }),
    {
      onError: (e) => {
        console.log(e);
      },
      onSuccess: (request) => {
        queryClient.invalidateQueries(['delegation']);
        setShowPopup(false);
      },
      retry: false,
    },
  );

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

  const JAOptions = user?.roles.orgs;
  const {
    data: delegatedUsers,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery(['delegation'], () => api.getDelegatedUsers(), {
    enabled: !!user?.companyCode,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const delegatedUsersColumns = {
    userName: { label: 'Vardas', show: true },
    actions: { label: 'Veiksmai', show: true },
  };

  const mapDelegatedUsersData = (item, onDelete) => {
    return {
      id: item.userId,
      userName: item.userName,
      actions: (
        <Button variant={ButtonVariants.OUTLINE} onClick={() => onDelete(item.userId)}>
          Šalinti
        </Button>
      ),
    };
  };

  const tableData = {
    data: delegatedUsers?.map((item) => mapDelegatedUsersData(item, removeDelegatedUsers)) || [],
    totalPages: 1,
    page: 1,
    pageSize: delegatedUsers?.length || 0,
    totalCount: delegatedUsers?.length || 0,
  };

  const validate = (values) => {
    const errors: FormErrors = {};

    if (!values.firstName) {
      errors.firstName = 'Būtina';
    }
    if (!values.lastName) {
      errors.lastName = 'Būtina';
    }
    if (!values.personalCode) {
      errors.personalCode = 'Būtina';
    }

    return errors;
  };

  return (
    <OuterContainer>
      {!isJA && (
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
      )}
      {isJA && (
        <PopupContainer width="600px">
          <TitleContainer>
            <Title>Deleguoti asmenys</Title>
            <Button variant={ButtonVariants.OUTLINE} onClick={() => setShowPopup(true)}>
              Deleguoti žmogų
            </Button>
          </TitleContainer>
          <Table
            loading={usersLoading}
            notFoundInfo={{ text: 'Nėra deleguotų asmenų', onClick: () => {} }}
            data={tableData}
            columns={delegatedUsersColumns}
            showPageSizeDropdown={false}
          />

          <Modal visible={showPopup}>
            <PopupContainer>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={(values) => addDelegatedUsers(values)}
                validateOnChange={false}
                validate={(values) => validate(values)}
              >
                {({ values, errors, setFieldValue }) => {
                  return (
                    <FormContainer>
                      <Title>Pridėkite asmenį, kuris atstovaus JA</Title>
                      <Grid>
                        <TextField
                          label={'Vardas'}
                          value={values.firstName}
                          error={errors.firstName}
                          name="firstName"
                          onChange={(phone) => setFieldValue('firstName', phone)}
                        />
                        <TextField
                          label={'Pavardė'}
                          name="lastName"
                          value={values.lastName}
                          error={errors.lastName}
                          onChange={(email) => setFieldValue('lastName', email)}
                        />
                        <NumericField
                          label={'Asmens kodas'}
                          name="personalCode"
                          value={values.personalCode}
                          error={errors.personalCode}
                          onChange={(code) => setFieldValue('personalCode', code)}
                        />
                      </Grid>
                      <ButtonContainer>
                        <Button
                          type="button"
                          onClick={() => setShowPopup(false)}
                          disabled={isSubmitLoading}
                        >
                          {'Atšaukti'}
                        </Button>
                        <Button type="submit" loading={isSubmitLoading} disabled={isSubmitLoading}>
                          {'Pridėti asmenį'}
                        </Button>
                      </ButtonContainer>
                    </FormContainer>
                  );
                }}
              </Formik>
            </PopupContainer>
          </Modal>
        </PopupContainer>
      )}
    </OuterContainer>
  );
};
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid grey;
  padding: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormContainer = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  margin-bottom: 20px;

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
