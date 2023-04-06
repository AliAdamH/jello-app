import React, { useState } from 'react';
import styled from 'styled-components';
import Card from 'pages/board/task/Card';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import NewTask from 'pages/board/task/NewTask';
import { FaTrash } from 'react-icons/fa';
import EditableColumnTitle from './EditableColumnTitle';
import {
  useCreateTaskMutation,
  useDeleteColumnMutation,
  useUpdateColumnMutation,
  useGetBoardTasksQuery,
} from 'api/ApiSlice';
import { Box, Button, Flex } from '@chakra-ui/react';

const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 0.375rem;
  width: 320px;
  background-color: #eee;
  display: flex;
  flex-direction: column;
`;

const InnerList = React.memo(({ taskOrders, boardId }) => {
  const { isSuccess, isFetching } = useGetBoardTasksQuery(boardId);
  if (isSuccess && !isFetching) {
    return taskOrders.map((id, index) => {
      return <Card key={id} id={id} index={index} boardId={boardId} />;
    });
  }
  return <div>loading...</div>;
});

const Column = ({ id, index, title, taskOrders, boardId }) => {
  const [createTaskMutation, taskMutationResult] = useCreateTaskMutation();
  const [deleteColumnMutation, columnMutationResult] =
    useDeleteColumnMutation();
  const [updateColumnMutation] = useUpdateColumnMutation();
  const [isHavingNewTask, setIsHavingNewTask] = useState(false);

  const removeNewTask = () => {
    setIsHavingNewTask(false);
  };

  const addTask = (titleValue) => {
    createTaskMutation({
      task: { column_id: id, title: titleValue },
      boardId,
    });
    setIsHavingNewTask(false);
  };

  const handleColumnDeletion = () => {
    deleteColumnMutation({ columnId: id, boardId });
  };

  const handleTitleUpdate = (newTitle) => {
    let columnObject = {
      columnId: id,
      title: newTitle,
    };

    updateColumnMutation(columnObject);
  };

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <Box
              display={'flex'}
              alignItems="center"
              gap={1}
              px={2}
              {...provided.dragHandleProps}
            >
              <EditableColumnTitle
                title={title}
                handleTitleUpdate={handleTitleUpdate}
              />
              <Button px={3} py={2} onClick={handleColumnDeletion}>
                <FaTrash fontSize={'12px'} />
              </Button>
            </Box>

            <Droppable type="task" droppableId={id}>
              {(provided, snapshot) => (
                <Flex
                  direction={'column'}
                  overflow={'hidden'}
                  overflowY="auto"
                  maxHeight={'calc(100vh - 256px)'}
                  gap={2}
                  pr={0.5}
                >
                  <Box
                    minHeight={4}
                    padding={2}
                    /* bg={snapshot.isDraggingOver ? 'blue.400' : '#eee'}*/
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <InnerList taskOrders={taskOrders} boardId={boardId} />
                    {provided.placeholder}
                  </Box>
                </Flex>
              )}
            </Droppable>
            <Flex>
              {!isHavingNewTask ? (
                <>
                  <Button
                    w="full"
                    display={'flex'}
                    justifyContent="flex-start"
                    fontSize={'sm'}
                    _hover={{ bg: 'blackAlpha.200' }}
                    fontWeight="normal"
                    px={2}
                    py={0}
                    onClick={() => setIsHavingNewTask(true)}
                  >
                    + Add a new card
                  </Button>
                  <Button> &#9883; </Button>
                </>
              ) : (
                <>
                  <NewTask
                    handleFocusOutOfNewTask={removeNewTask}
                    handleTaskCreation={addTask}
                  />
                </>
              )}
            </Flex>
          </Container>
        )}
      </Draggable>
    </>
  );
};

export default Column;
