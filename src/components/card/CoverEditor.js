import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateTask } from './taskSlice';
import { handleCoverColorChange } from './taskSlice';
import { taskCoverColorUpdate } from '../board/boardSlice';

const ColorInput = styled.input`
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  cursor: pointer;
  height: 5rem;
  padding: 0;
  width: 5rem;
  margin-inline: auto;
`;

const ActionButton = styled.button`
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
  border-radius: 0.375rem;
  background-color: ${(props) => props.bgColor};
  transition: opacity 0.3s ease;
  margin-left: auto;
  &:hover {
    opacity: 0.7;
  }
`;
function CoverEditor({ closeEditor }) {
  const task = useSelector((state) => state.tasks.task);
  const coverColorRef = useRef(null);

  const dispatch = useDispatch();
  const handleCoverColorUpdate = () => {
    const newCoverColor = coverColorRef.current.value;
    console.log('the value is', newCoverColor);
    if (newCoverColor !== task.coverColor) {
      dispatch(handleCoverColorChange(newCoverColor));
      dispatch(updateTask());
      dispatch(
        taskCoverColorUpdate({
          ...task,
          coverColor: newCoverColor,
        })
      );
    }
    closeEditor();
  };

  return (
    <>
      <div
        style={{
          marginInline: 'auto',
          borderBottom: '4px solid limegreen',
          paddingBlock: '0.5rem',
        }}
      >
        Choose a new color for your card
      </div>
      <ColorInput
        ref={coverColorRef}
        type={'color'}
        defaultValue={task.coverColor}
      />
      <div>{task.coverColor}</div>
      <ActionButton bgColor={'lightblue'} onClick={handleCoverColorUpdate}>
        Save
      </ActionButton>
    </>
  );
}

export default CoverEditor;
