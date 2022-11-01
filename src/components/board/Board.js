import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import background from '../../background-example.jpg';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from '../column/Column';

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
  const { column, taskMap, index } = props;
  const tasks = column.taskOrders.map((taskId) => taskMap[taskId]);
  return <Column column={column} tasks={tasks} index={index} />;
});

function Board() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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

    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = [...data.colOrderIds];
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...data,
        colOrderIds: newColumnOrder,
      };
      setData(newState);

      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskOrders);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskOrders: newTaskIds,
      };

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

    handleTaskMovement(draggableId, newFinish, newStart);
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
                      index={idx}
                    />
                  );
                })}
                {provided.placeholder}
              </BoardContainer>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}

export default Board;
