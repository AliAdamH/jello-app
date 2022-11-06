import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';
import ExpandedCard from './ExpandedCard';
import Modal from 'react-modal';

Modal.setAppElement('#root');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0, 0.6)';
Modal.defaultStyles.overlay.overflowY = 'scroll';

const StyledModal = styled(Modal)`
  width: 50vw;
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
  const [expanded, setExpanded] = useState(false);

  const closeExpanded = () => {
    console.log('hello');
    setExpanded((prev) => !prev);
    console.log('Expanded is:', expanded);
  };

  return (
    <>
      <Draggable draggableId={props.task.id} index={props.index}>
        {(provided, snapshot) => (
          <CardContainer
            onClick={() => setExpanded(true)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {props.task.title}
          </CardContainer>
        )}
      </Draggable>
      <StyledModal
        isOpen={expanded}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setExpanded(false)}
      >
        <ExpandedCard title={props.task.title} />
      </StyledModal>
    </>
  );
};

export default Card;
