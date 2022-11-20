import React, { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';
import ExpandedCard from './ExpandedCard';
import Modal from 'react-modal';

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
  align-items: flex-end;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.fontColor};

  &:hover {
    cursor: pointer;
  }
`;
const Card = (props) => {
  const [expanded, setExpanded] = useState(false);

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
            bgColor={props.task.coverColor}
            fontColor={props.task.coverTextColor}
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
        <ExpandedCard taskId={props.task.id} close={() => setExpanded(false)} />
      </StyledModal>
    </>
  );
};

export default Card;
