import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Card from 'pages/board/task/Card';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import NewTask from 'pages/board/task/NewTask';
import { FaTrash } from 'react-icons/fa';
import {
  columnDeletion,
  deleteColumn,
  optimisticColumnTitleUpdate,
  updateColumnTitle,
} from 'pages/board/boardSlice';
import { useDispatch } from 'react-redux';
import EditableColumnTitle from './EditableColumnTitle';
import { createSelector } from '@reduxjs/toolkit';
import { useGetBoardDataQuery } from 'api/ApiSlice';
const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 0.375rem;
  width: 320px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 0.75rem;
  flex: 1;
  background-color: #eee;
`;
const TaskList = styled.div`
  min-height: 1rem;
  flex: 1;
  padding: 0.5rem;
  transition: background-color 0.2s ease;
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : '#eee')};
`;

const Footer = styled.div`
  padding: 0.2rem;
  background-color: #eee;
  display: flex;
`;

const NewCardButton = styled.button`
  padding: 0.3rem;
  border-radius: 0.25rem;
  flex: 1;
  text-align: start;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ddd;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding-inline: 0.5rem;
`;

const DeleteButton = styled.button`
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  transtition: background-color 0.35s ease;
  border-radius: 0.375rem;
  &:hover {
    background-color: #ddd;
  }
`;

const MiscButton = styled.button`
  padding-block: 0.3rem;
  padding-inline: 0.4rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ddd;
  }
`;

const NewInnerList = React.memo(({ tasks }) => {
  return tasks.map(([id, taskData], index) => {
    return <Card key={id} {...taskData} index={index} />;
  });
});

const InnerList = React.memo((props) => {
  return props.tasks.map((task, index) => (
    <Card key={task.id} task={task} index={index} />
  ));
});

const Column = ({ id, index, title, createTask }) => {
  const dispatch = useDispatch();
  const selectTasksForColumn = useMemo(() => {
    const fallbackArray = [];

    return createSelector(
      (res) => res.data,
      (res, columnId) => columnId,
      (data, columnId) =>
        Object.entries(data?.tasks).filter(([_, hash]) => {
          return hash.columnId === columnId;
        }) ?? fallbackArray
    );
  }, []);
  const { tasksForColumn } = useGetBoardDataQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      tasksForColumn: selectTasksForColumn(result, id),
    }),
  });
  const [isHavingNewTask, setIsHavingNewTask] = useState(false);

  const removeNewTask = () => {
    setIsHavingNewTask(false);
  };

  const addTask = (titleValue) => {
    createTask(id, titleValue);
    setIsHavingNewTask(false);
  };

  const handleColumnDeletion = () => {
    dispatch(columnDeletion(id));
    dispatch(deleteColumn(id));
  };

  const handleTitleUpdate = (newTitle) => {
    let columnObject = {
      columnId: id,
      title: newTitle,
    };

    dispatch(optimisticColumnTitleUpdate(columnObject));
    dispatch(updateColumnTitle(columnObject));
  };

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <TitleWrapper {...provided.dragHandleProps}>
              <EditableColumnTitle
                title={title}
                handleTitleUpdate={handleTitleUpdate}
              />
              {/* <Title {...provided.dragHandleProps}>{title}</Title> */}
              <DeleteButton onClick={handleColumnDeletion}>
                <FaTrash fontSize={'12px'} />
              </DeleteButton>
            </TitleWrapper>
            <Droppable type="task" droppableId={id}>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <NewInnerList tasks={tasksForColumn} />
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
            <Footer>
              {!isHavingNewTask ? (
                <>
                  <NewCardButton onClick={() => setIsHavingNewTask(true)}>
                    + Add a new card
                  </NewCardButton>
                  <MiscButton> &#9883; </MiscButton>
                </>
              ) : (
                <>
                  <NewTask
                    handleFocusOutOfNewTask={removeNewTask}
                    handleTaskCreation={addTask}
                  />
                </>
              )}
            </Footer>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Column;
