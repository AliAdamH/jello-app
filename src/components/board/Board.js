import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import background from '../../background-example.jpg';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from '../column/Column';
import NewColumn from '../column/NewColumn';
import { useDispatch } from 'react-redux';
import { taskInnerReorder, updateColumnOrder } from './boardSlice';

const BoardContainer = styled.div`
  background-image: url(${(props) => props.imageLink});
  background-position: center;
  background-size: cover;
  margin-top: 64px;
  height: calc(100vh - 64px);
  padding-inline: 2rem;
  padding-block: 0.625rem;
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  align-items: start;

  & > * {
    flex-shrink: 0;
  }
`;

const filterTasks = (tasks, taskToRemoveId) => {
  const deepCopy = JSON.parse(JSON.stringify(tasks));
  return Object.keys(deepCopy)
    .filter((key) => key !== taskToRemoveId)
    .reduce((obj, key) => {
      return (obj[key] = { ...obj, [key]: deepCopy[key] });
    }, {});
};

const ColumnsWrapper = React.memo((props) => {
  const { column, taskMap, index, handleCreateTask } = props;
  const tasks = column.taskOrders.map((taskId) => taskMap[taskId]);
  return (
    <Column
      column={column}
      tasks={tasks}
      index={index}
      createTask={handleCreateTask}
    />
  );
});

function Board() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      fetch('http://localhost:3000/api/v1/boards')
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const handleTaskMovement = (taskId, targetColumn, initialColumn) => {
    const requestBody = {
      to_col: {
        id: targetColumn.id,
        task_orders: targetColumn.taskOrders,
      },
      from_col: {
        id: initialColumn.id,
        task_orders: initialColumn.taskOrders,
      },
    };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    };
    fetch('http://localhost:3000/api/v1/tasks/' + taskId, requestOptions).catch(
      (error) => console.error(error)
    );
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    // User has dragged the card outside of any droppable.
    if (!destination) {
      return;
    }

    // User has lifted the card but dropped it at the same place.
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // User has dragged a column.
    if (type === 'column') {
      const newColumnOrder = [...data.colOrderIds];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        colOrderIds: newColumnOrder,
      };
      dispatch(
        updateColumnOrder({
          boardId: newState.id,
          newColOrderIds: newColumnOrder,
        })
      );
      setData(newState);

      return;
    }

    // User has dragged a card and changed its position.

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // User has dragged the card in the same column.
    if (start === finish) {
      const newTaskIds = Array.from(start.taskOrders);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskOrders: newTaskIds,
      };

      dispatch(
        taskInnerReorder({
          columnId: newColumn.id,
          taskOrderIds: newTaskIds,
        })
      );
      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    // User has dragged the card from a column to another.

    const startTaskIds = [...start.taskOrders];
    startTaskIds.splice(source.index, 1);
    const movedTask = start.tasks[draggableId];
    const newTasks = filterTasks(start.tasks, draggableId);
    const newStart = {
      ...start,
      taskOrders: startTaskIds,
      tasks: newTasks,
    };

    const finishTaskIds = [...finish.taskOrders];
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishTasks = { ...finish.tasks, [draggableId]: movedTask };
    const newFinish = {
      ...finish,
      taskOrders: finishTaskIds,
      tasks: newFinishTasks,
    };

    // Server side update.
    handleTaskMovement(draggableId, newFinish, newStart);

    // UI Optimistic Update.
    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  const handleCreateTask = async (columnId, value) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: { column_id: columnId, title: value },
      }),
    };

    let apiTaskResponse = await fetch(
      'http://localhost:3000/api/v1/tasks',
      requestOptions
    );
    let createdTask = await apiTaskResponse.json();
    const newColumn = { ...data.columns[columnId] };

    console.log(createdTask);

    const newTasks = {
      ...newColumn.tasks,
      [createdTask.id]: createdTask,
    };
    const newTaskOrders = [...newColumn.taskOrders, Number(createdTask.id)];
    console.log(newTaskOrders);
    const updatedColumn = {
      ...newColumn,
      tasks: newTasks,
      taskOrders: newTaskOrders,
    };
    setData((previousState) => {
      return {
        ...previousState,
        columns: {
          ...previousState.columns,
          [updatedColumn.id]: updatedColumn,
        },
      };
    });
  };

  const handleNewColumn = async (columnTitle) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        column: { title: columnTitle, board_id: data.id },
      }),
    };

    let apiColumnResponse = await fetch(
      'http://localhost:3000/api/v1/columns',
      requestOptions
    );
    let createdColumn = await apiColumnResponse.json();
    console.log(createdColumn);

    setData((previous) => {
      return {
        ...previous,
        columns: {
          ...previous.columns,
          [createdColumn.id]: createdColumn,
        },
        colOrderIds: [...previous.colOrderIds, createdColumn.id],
      };
    });
  };

  return (
    <>
      {!loading && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" type="column" direction="horizontal">
            {(provided) => (
              <BoardContainer
                imageLink={background}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {data.colOrderIds.map((col, idx) => {
                  const column = data.columns[col];

                  return (
                    <ColumnsWrapper
                      key={column.id}
                      column={column}
                      taskMap={column.tasks}
                      handleCreateTask={handleCreateTask}
                      index={idx}
                    />
                  );
                })}
                {provided.placeholder}
                <NewColumn handleNewColumn={handleNewColumn} />
              </BoardContainer>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}

export default Board;
