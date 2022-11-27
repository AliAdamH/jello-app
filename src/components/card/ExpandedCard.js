import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import CardActivityFeed from './CardActivityFeed';
import EditableDescription from './EditableDescription';
import EditableTitle from './EditableTitle';
import ExpandedCardActions from './ExpandedCardActions';
import { deleteTask, taskDeletion, taskTitleUpdate } from '../board/boardSlice';
import {
  fetchTask,
  handleTitleChange,
  updateTask,
  resetTaskState,
  handleDescriptionChange,
  handleDueDateExceeded,
} from './taskSlice';
import SideEditor from './SideEditor';

const Expanded = styled.div`
  border-radius: 0.375rem;
  background-color: #eee;
  height: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
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

const SideEditorContainer = styled.div`
  position: absolute;
  height: fit-content;
  right: -200px;
  width: 300px;
  padding: 1rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 0 1em rgba(0 0 0 / 0.6);
`;

function ExpandedCard({ title, description, close, taskId }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.tasks.status);
  const task = useSelector((state) => state.tasks.task);
  const [sideEditorOpen, setSideEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('cover');
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
    dispatch(handleDescriptionChange(newDescriptionValue));
    dispatch(updateTask());
  };

  // Is the card overdue ? Use the local date to send answer
  // to server.
  useEffect(() => {
    if (status === 'successful') {
      const clientCurrentDate = new Date().toLocaleDateString('en-CA');
      if (
        task.dueDate &&
        task.dueDateStatus === 'idle' &&
        clientCurrentDate.localeCompare(task.dueDate) > 0
      ) {
        dispatch(handleDueDateExceeded());
        dispatch(updateTask());
        console.log('FIRED !');
      }
    }
  }, [status, task?.dueDate, task?.dueDateStatus, dispatch]);

  useEffect(() => {
    return () => dispatch(resetTaskState());
  }, [dispatch]);

  const handleEditorOpening = (component) => {
    !sideEditorOpen && setSideEditorOpen(true);
    setEditorContent(component);
  };

  const handleDeleteTask = () => {
    close();
    dispatch(
      taskDeletion({
        taskId: task.id,
        columnId: task.columnId,
      })
    );
    dispatch(deleteTask(task.id));
  };

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
              <EditableDescription
                description={task.description}
                handleDescriptionUpdate={handleDescriptionUpdate}
              />
              <CardActivityFeed />
            </Left>
            <Right>
              <ExpandedCardActions
                openEditor={handleEditorOpening}
                deleteTask={handleDeleteTask}
              />
            </Right>
          </Body>
          {sideEditorOpen ? (
            <SideEditorContainer>
              <SideEditor
                editorToRender={editorContent}
                closeEditor={() => setSideEditorOpen(false)}
              />
            </SideEditorContainer>
          ) : (
            <></>
          )}
        </Expanded>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default ExpandedCard;
