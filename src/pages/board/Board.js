import React from 'react';
import styled from 'styled-components';
import background from '../../background-example.jpg';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './column/Column';
import NewColumn from './column/NewColumn';
import {
  useGetBoardDataQuery,
  useCreateColumnMutation,
  useUpdateColumnOrderMutation,
  useUpdateTaskVerticalOrderMutation,
  useUpdateTaskHorizontalOrderMutation,
} from 'api/ApiSlice';
import TaskModal from './task/TaskModal';

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

const ColumnsWrapper = React.memo((props) => {
  const { column, index, boardId } = props;
  return <Column boardId={boardId} {...column} index={index} />;
});

function Board() {
  const { isLoading: loading, data } = useGetBoardDataQuery();
  const [createColumnMutation] = useCreateColumnMutation();
  const [updateColumnOrderMutation] = useUpdateColumnOrderMutation();
  const [taskVerticalReorderMutation] = useUpdateTaskVerticalOrderMutation();
  const [taskHorizontalReorderMutation] =
    useUpdateTaskHorizontalOrderMutation();

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

      updateColumnOrderMutation({
        boardId: data.id,
        newColOrderIds: newColumnOrder,
      });
      return;
    }

    // User has dragged a card and changed its position.

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // User has dragged the card in the same column.
    if (start === finish) {
      const newTaskIds = Array.from(start.taskOrders);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, Number(draggableId));
      taskVerticalReorderMutation({
        columnId: start.id,
        newTaskIds,
        boardId: data.id,
      });
      return;
    }

    // User has dragged the card from a column to another.

    const startTaskIds = [...start.taskOrders];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskOrders: startTaskIds,
    };

    const finishTaskIds = [...finish.taskOrders];
    finishTaskIds.splice(destination.index, 0, Number(draggableId));
    const newFinish = {
      ...finish,
      taskOrders: finishTaskIds,
    };

    taskHorizontalReorderMutation({
      taskId: draggableId,
      targetColumn: newFinish,
      initialColumn: newStart,
    });
  };

  const handleNewColumn = (columnTitle) => {
    createColumnMutation({
      column: { title: columnTitle, board_id: data.id },
    });
  };

  return (
    <>
      {!loading && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="columns"
              type="column"
              direction="horizontal"
            >
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
                        index={idx}
                        boardId={data.id}
                      />
                    );
                  })}
                  {provided.placeholder}
                  <NewColumn handleNewColumn={handleNewColumn} />
                </BoardContainer>
              )}
            </Droppable>
          </DragDropContext>
          <TaskModal boardId={data.id} />
        </>
      )}
    </>
  );
}

export default Board;
