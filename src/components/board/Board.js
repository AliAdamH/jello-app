import React, { useState } from 'react';
import styled from 'styled-components';
import background from '../../background-example.jpg';
import { DragDropContext } from '@hello-pangea/dnd';
import initalData from '../../initial-data';
import Column from '../column/Column';
import initialData from '../../initial-data';

const BoardContainer = styled.div`
  background-image: url(${(props) => props.imageLink});
  background-position: center;
  background-size: cover;
  margin-top: 64px;
  height: calc(100vh - 64px);
  padding-inline: 2rem;
  padding-block: 0.625rem;
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  align-items: start;
`;

function Board() {
  const [data, setData] = useState(initialData);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    const column = data.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn,
      },
    };

    setData(newData);
  };

  return (
    <>
      <BoardContainer imageLink={background}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {data.columnOrder.map((col, idx) => {
            const column = data.columns[col];
            const tasks = column.taskIds.map((taskId) => {
              return data.tasks[taskId];
            });

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </DragDropContext>
      </BoardContainer>
    </>
  );
}

export default Board;
