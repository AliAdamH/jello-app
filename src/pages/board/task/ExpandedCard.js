import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import CardActivityFeed from './CardActivityFeed';
import EditableDescription from './EditableDescription';
import EditableTitle from './EditableTitle';
import ExpandedCardActions from './ExpandedCardActions';
import {
  handleTitleChange,
  updateTask,
  resetTaskState,
  handleDescriptionChange,
  handleDueDateExceeded,
} from './taskSlice';
import SideEditor from './SideEditor';
import isEmpty from 'lodash.isempty';
import LabelsList from '../labels/LabelsList';
import {
  useGetTaskQuery,
  useDeleteTaskMutation,
  useUpdateTaskDataMutation,
} from 'api/ApiSlice';

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

function ExpandedCard({ close, taskId, boardId }) {
  const dispatch = useDispatch();
  const { data: task, isSuccess } = useGetTaskQuery(taskId);
  const [sideEditorOpen, setSideEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('cover');
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [taskUpdateMutation] = useUpdateTaskDataMutation();

  const handleTitleUpdate = (newTitleValue) => {
    // dispatch(handleTitleChange(newTitleValue));
    // dispatch(updateTask());
    taskUpdateMutation({
      task: {
        ...task,
        title: newTitleValue,
      },
      boardId,
    });
  };

  const handleDescriptionUpdate = (newDescriptionValue) => {
    dispatch(handleDescriptionChange(newDescriptionValue));
    dispatch(updateTask());
  };

  useEffect(() => {
    if (isSuccess) {
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
  }, [isSuccess, task?.dueDate, task?.dueDateStatus, dispatch]);

  useEffect(() => {
    return () => dispatch(resetTaskState());
  }, [dispatch]);

  const handleEditorOpening = (component) => {
    !sideEditorOpen && setSideEditorOpen(true);
    setEditorContent(component);
  };

  const handleDeleteTask = () => {
    close();
    deleteTaskMutation({ task, boardId });
  };

  return (
    <>
      {isSuccess ? (
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
              {!isEmpty(task.labels) ? (
                <LabelsList labels={task.labels} />
              ) : null}
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
                taskId={taskId}
                editorToRender={editorContent}
                closeEditor={() => setSideEditorOpen(false)}
                boardId={boardId}
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
