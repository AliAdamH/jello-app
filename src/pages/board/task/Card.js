import React, { useMemo, useCallback } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { createSelector } from '@reduxjs/toolkit';
import { useGetBoardTasksQuery } from 'api/ApiSlice';
import { useDispatch } from 'react-redux';
import { setOpenTaskId } from 'store/modalSlice';
import { Box, Flex } from '@chakra-ui/react';

const Card = ({ id, index, boardId }) => {
  const dispatch = useDispatch();
  const selectTask = useMemo(() => {
    const fallbackArray = [];

    return createSelector(
      (res) => res.data,
      (res, taskId) => taskId,
      (data, taskId) => {
        return data[taskId];
      }
    );
  }, []);
  const { task, isLoading, isSuccess, isFetching } = useGetBoardTasksQuery(
    boardId,
    {
      selectFromResult: (result) => ({
        ...result,
        task: selectTask(result, id),
      }),
    }
  );

  const openModal = useCallback(() => {
    dispatch(setOpenTaskId(id));
  }, [dispatch, id]);
  return (
    <>
      {isSuccess && !isFetching && (
        <Draggable draggableId={String(id)} index={index}>
          {(provided, snapshot) => (
            <Flex
              direction={'column'}
              justifyContent="flex-end"
              gap={2}
              p={2}
              mb={1}
              onClick={openModal}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              borderRadius={'md'}
              ref={provided.innerRef}
              skewY={snapshot.isDragging ? '45deg' : '0deg'}
              minH={16}
              borderBottom="2px solid lightgray"
              h={'fit-content'}
              cursor="pointer"
              bg={task.coverColor}
              color={task.coverTextColor}
            >
              <Flex gap={1}>
                {Object.keys(task.labels).map((k, _) => {
                  return (
                    <Box
                      key={k}
                      borderRadius="full"
                      w={3}
                      h={3}
                      border={`1px solid ${task.coverTextColor}`}
                      backgroundColor={task.labels[k].color}
                    />
                  );
                })}
              </Flex>
              {task.title}
            </Flex>
          )}
        </Draggable>
      )}
    </>
  );
};

export default Card;
