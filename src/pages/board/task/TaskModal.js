import React, { useCallback } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { removeOpenTask } from 'store/modalSlice';
import styled from 'styled-components';
import ExpandedCard from './ExpandedCard';
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
function TaskModal({ boardId }) {
  const expanded = useSelector((state) => state.modal.open);
  const taskId = useSelector((state) => state.modal.data.taskId);
  const dispatch = useDispatch();

  const close = useCallback(() => {
    dispatch(removeOpenTask());
  }, [dispatch]);

  return (
    <StyledModal
      isOpen={expanded}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
    >
      <ExpandedCard boardId={boardId} taskId={taskId} close={close} />
    </StyledModal>
  );
}

export default TaskModal;
