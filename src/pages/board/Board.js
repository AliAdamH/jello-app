import React from 'react';
import styled from 'styled-components';
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
import { Box, Flex } from '@chakra-ui/react';

const _testBackgroundUrl =
  "url('https://images.unsplash.com/photo-1680675805063-3aa8b3607b0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')";
const containerProps = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  mt: 10,
  h: '92vh',
  mr: 8,
  pl: 4,
  py: 8,
  gap: 2,
  maxWidth: 'full',
  maxHeight: 'calc(100vh - 56px)',
  alignItems: 'flex-start',
  position: 'absolute',
};

const backgroundProps = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  width: '100vw',
  maxWidth: 'full',
  mt: 14,
  h: '100vh',
  zIndex: -1,
};

const BoardContainer = styled.div``;

const ColumnsWrapper = React.memo((props) => {
  const { column, index, boardId } = props;
  return (
    <Box flexShrink={0}>
      <Column boardId={boardId} {...column} index={index} />
    </Box>
  );
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
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Box
                    backgroundImage={_testBackgroundUrl}
                    position="fixed"
                    {...backgroundProps}
                    top={0}
                  />
                  <Flex {...containerProps}>
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
                  </Flex>
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
