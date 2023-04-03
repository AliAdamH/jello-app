import React from 'react';
import styled from 'styled-components';
import background from '../../background-example.jpg';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Column from './column/Column';
import NewColumn from './column/NewColumn';
import { useDispatch } from 'react-redux';
import {
  fullTaskMovement,
  newColumn,
  optimisticColumnDrag,
  optimisticFullTaskReorder,
  optimisticInnerTaskReorder,
  taskInnerReorder,
  updateColumnOrder,
} from './boardSlice';
import {
  useGetBoardDataQuery,
  useCreateColumnMutation,
  useUpdateColumnOrderMutation,
} from 'api/ApiSlice';

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
  const { column, index } = props;
  return <Column {...column} index={index} />;
});

function Board() {
  // const data = useSelector((state) => state.boards.data);
  // const dataStatus = useSelector((state) => state.boards.status);
  // const [loading, setLoading] = useState(true);
  const { isLoading: loading, data } = useGetBoardDataQuery();
  const [createColumnMutation, result] = useCreateColumnMutation();
  const [updateColumnOrderMutation] = useUpdateColumnOrderMutation();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (dataStatus === 'idle') {
  //     dispatch(fetchBoardData());
  //     dispatch(fetchLabelsOfBoard());
  //   }
  // }, [dataStatus, dispatch]);

  // useEffect(() => {
  //   if (dataStatus === 'success') {
  //     setLoading(false);
  //   }
  // }, [dataStatus]);

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

      // const newState = {
      //   ...data,
      //   colOrderIds: newColumnOrder,
      // };

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
      newTaskIds.splice(destination.index, 0, draggableId);

      dispatch(
        optimisticInnerTaskReorder({
          columnId: start.id,
          newTaskOrders: newTaskIds,
        })
      );

      dispatch(
        taskInnerReorder({
          columnId: start.id,
          taskOrderIds: newTaskIds,
        })
      );
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
    // UI Optimistic Update.
    dispatch(
      optimisticFullTaskReorder({
        startColumnId: start.id,
        finishColumnId: finish.id,
        updatedStart: newStart,
        updatedFinish: newFinish,
      })
    );

    // Server side update.
    dispatch(
      fullTaskMovement({
        taskId: draggableId,
        targetColumn: newFinish,
        initialColumn: newStart,
      })
    );
  };

  const handleNewColumn = (columnTitle) => {
    createColumnMutation({
      column: { title: columnTitle, board_id: data.id },
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
