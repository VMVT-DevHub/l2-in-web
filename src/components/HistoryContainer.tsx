import { Button } from '@aplinkosministerija/design-system';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FormHistory } from '../types';
import api from '../utils/api';
import { colorsByStatus } from '../utils/constants';
import { formatDateAndTime } from '../utils/format';
import { useInfinityLoad } from '../utils/hooks';
import { requestFormHistoryDescriptions, requestStatusLabels } from '../utils/text';
import FullscreenLoader from './FullscreenLoader';
import Icon, { IconName } from './Icons';
import StatusTag from './StatusTag';

const HistoryContainer = ({ open, requestId }: { open: boolean; requestId: any }) => {
  const observerRef = useRef(null);

  const { data: history, isFetching } = useInfinityLoad(
    `requestHistory-${requestId}`,
    (data) => api.getRequestHistory({ ...data, id: requestId }),
    observerRef,
    {},
    !!requestId,
  );

  const [isOpen, setIsOpen] = useState(open);

  if (!isOpen) {
    return (
      <SideBar $padding={'16px 8px'} $width={'40px'}>
        <IconContainer onClick={() => setIsOpen(true)}>
          <ArrowIcon name={IconName.info} />
        </IconContainer>
      </SideBar>
    );
  }

  return (
    <SideBar $padding={'16px'} $width={'320px'}>
      <Row>
        <Title>Veikla</Title>
        <IconContainer onClick={() => setIsOpen(false)}>
          <ArrowIcon name={IconName.arrowRight} />
        </IconContainer>
      </Row>
      <SubTitleRow>
        <SubTitle>{'Istorija'}</SubTitle>
        <Line />
      </SubTitleRow>
      <Container>
        {history?.pages.map((page: { data: FormHistory[] }, pageIndex: number) => {
          return (
            <React.Fragment key={`history-${pageIndex}`}>
              {page?.data.map((history, index) => {
                const createdBy = `${history?.createdBy?.firstName?.[0]}. ${history?.createdBy?.lastName}`;
                return (
                  <Column key={`inner-history-${index}`}>
                    <HistoryRow>
                      <DateContainer>{formatDateAndTime(history.createdAt)}</DateContainer>
                      <StatusTag
                        label={requestStatusLabels[history.type]}
                        color={colorsByStatus[history.type]}
                      />
                    </HistoryRow>
                    <Text>
                      <BoldText>{createdBy}</BoldText>
                      {requestFormHistoryDescriptions[history.type]}
                    </Text>
                    {history?.comment && (
                      <Comment>
                        <Text>{history?.comment}</Text>
                      </Comment>
                    )}
                    <Line />
                  </Column>
                );
              })}
            </React.Fragment>
          );
        })}

        {isFetching && <FullscreenLoader />}
        {observerRef && <div ref={observerRef} />}
      </Container>
    </SideBar>
  );
};

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBUtton = styled(Button)`
  margin: 16px 0;
  border-color: ${({ theme }) => theme.colors.primary};
`;

const DateContainer = styled.div`
  font-size: 1.2rem;
  color: #697586;
`;

const Container = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ArrowIcon = styled(Icon)`
  font-size: 1.7rem;
  color: black;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SideBar = styled.div<{ $width: string; $padding: string }>`
  min-width ${({ $width }) => $width};
  width ${({ $width }) => $width};
  background-color: white;
  overflow-y: auto;
  padding: ${({ $padding }) => $padding};
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 24px;
`;
const SubTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: #697586;
`;

const SubTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0 8px 0;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eaeaef;
`;

const Text = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 20px;
  color: #4b5565;
`;

const BoldText = styled.span`
  font-weight: 500;
  color: black;
  margin-right: 2px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
  gap: 15px;
`;

const Comment = styled.div`
  padding: 8px;
  border-radius: 4px 0px 0px 0px;
  background-color: #f8fafc;
`;

const StyledIcon = styled(Icon)`
  font-size: 2rem;
`;

const ContentRow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  cursor: pointer;
  grid-template-columns: 20px 1fr;
`;

const BreakWord = styled.div`
  word-break: break-word;
`;

export default HistoryContainer;
