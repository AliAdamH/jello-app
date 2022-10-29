import React from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';

const CardContainer = styled.div`
  border-radius: 0.375rem;
  border-bottom: 1px solid lightgray;
  min-height: 40px;
  height: fit-content;
  padding: 0.5rem;
  margin-bottom: 0.375rem;
  display: flex;
  align-items: flex-end;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};

  &:hover {
    cursor: pointer;
  }
`;
const Card = (props) => {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <CardContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {props.task.content}
        </CardContainer>
      )}
    </Draggable>
  );
};

export default Card;
