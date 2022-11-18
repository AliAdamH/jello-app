import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CardActivityFeed from './CardActivityFeed';
import EditableDescription from './EditableDescription';
import EditableTitle from './EditableTitle';
import ExpandedCardActions from './ExpandedCardActions';
import { taskTitleUpdate } from '../board/boardSlice';
import {
  fetchTask,
  handleTitleChange,
  updateTask,
  resetTaskState,
} from './taskSlice';

const Expanded = styled.div`
  border-radius: 0.375rem;
  background-color: #eee;
  height: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Cover = styled.div`
  height: 128px;
  border-radius: 0.375rem 0.375rem 0 0;
  background: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);
  position: relative;
`;

const CoverChangeButton = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 0.375rem;
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
  transition: opacity 0.3s ease;
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  &:hover {
    opacity: 0.7;
  }
`;

const ModalCloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  right: 2rem;
  color: white;
  top: 0.5rem;
  background-color: rgba(0, 0, 0, 0.3);

  &:hover {
    opacity: 0.7;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
`;

const Left = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 2rem;
`;

const Right = styled.div`
  width: 30%;
`;

function ExpandedCard({ title, description, close, taskId }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.tasks.status);
  const task = useSelector((state) => state.tasks.task);

  useEffect(() => {
    dispatch(fetchTask(taskId));
  }, [dispatch, taskId]);

  const handleTitleUpdate = (newTitleValue) => {
    dispatch(handleTitleChange(newTitleValue));
    dispatch(updateTask());
    dispatch(
      taskTitleUpdate({
        ...task,
        title: newTitleValue,
      })
    );
  };

  const handleDescriptionUpdate = (newDescriptionValue) => {
    return null;
  };

  useEffect(() => {
    return () => dispatch(resetTaskState());
  }, [dispatch]);

  return (
    <>
      {status === 'successful' ? (
        <Expanded>
          <Cover>
            <ModalCloseButton onClick={() => close()}>x</ModalCloseButton>
            <CoverChangeButton>Change</CoverChangeButton>
          </Cover>
          <Body>
            <Left>
              <EditableTitle
                title={task.title}
                columnTitle={'Test Column Title'}
                handleTitleUpdate={handleTitleUpdate}
              />
              <EditableDescription description={description} />
              <CardActivityFeed />
            </Left>
            <Right>
              <ExpandedCardActions />
            </Right>
          </Body>
        </Expanded>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default ExpandedCard;
