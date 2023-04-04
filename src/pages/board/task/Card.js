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
const Card = ({ id, index, labels, title, coverColor, coverTextColor }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <CardContainer
            onClick={() => setExpanded(true)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            bgColor={coverColor}
            fontColor={coverTextColor}
          >
            {/* <LabelsContainer>
              {Object.keys(labels).map((k, _) => {
                return (
                  <Label
                    key={k}
                    borderColor={coverTextColor}
                    backgroundColor={labels[k].color}
                  />
                );
              })}
            </LabelsContainer> */}
            {title}
          </CardContainer>
        )}
      </Draggable>
      <StyledModal
        isOpen={expanded}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setExpanded(false)}
      >
        <ExpandedCard taskId={id} close={() => setExpanded(false)} />
      </StyledModal>
    </>
  );
};

export default Card;
