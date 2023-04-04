import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';
import ExpandedCard from './ExpandedCard';
import Modal from 'react-modal';
import { createSelector } from '@reduxjs/toolkit';
import { useGetBoardTasksQuery } from 'api/ApiSlice';
Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0, 0.6)';
Modal.defaultStyles.overlay.overflowY = 'scroll';

const StyledModal = styled(Modal)`
  width: min(50vw, 764px);
  background-color: #eee;
  margin-top: 2rem;
  margin-bottom: 3rem;
  margin-inline: auto;
  min-height: 800px;
  border-radius: 0.375rem;
  outline: none;
`;

const CardContainer = styled.div`
  border-radius: 0.375rem;
  border-bottom: 1px solid lightgray;
  min-height: 64px;
  height: fit-content;
  padding: 0.5rem;
  margin-bottom: 0.375rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.5rem;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.fontColor};
  cursor: pointer;
`;

const LabelsContainer = styled.div`
  display: flex;
  gap: 0.2rem;
`;

const Label = styled.div`
  width: 0.825rem;
  height: 0.825rem;
  border-radius: 50%;
  border: 1px solid ${(props) => props.borderColor};
  background-color: ${(props) => props.backgroundColor};
`;
// { id, index, labels, title, coverColor, coverTextColor }
const Card = ({ id, index, boardId }) => {
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

  const [expanded, setExpanded] = useState(false);
  return (
    <>
      {isSuccess && !isFetching && (
        <Draggable draggableId={String(id)} index={index}>
          {(provided, snapshot) => (
            <CardContainer
              onClick={() => setExpanded(true)}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              bgColor={task.coverColor}
              fontColor={task.coverTextColor}
            >
              <LabelsContainer>
                {Object.keys(task.labels).map((k, _) => {
                  return (
                    <Label
                      key={k}
                      borderColor={task.coverTextColor}
                      backgroundColor={task.labels[k].color}
                    />
                  );
                })}
              </LabelsContainer>
              {task.title}
            </CardContainer>
          )}
        </Draggable>
      )}
      <StyledModal
        isOpen={expanded}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setExpanded(false)}
      >
        <ExpandedCard
          boardId={boardId}
          taskId={id}
          close={() => setExpanded(false)}
        />
      </StyledModal>
    </>
  );
};

export default Card;
