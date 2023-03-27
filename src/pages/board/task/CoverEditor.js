import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateTask } from './taskSlice';
import { handleCoverColorChange } from './taskSlice';
import { taskCoverColorUpdate } from '../boardSlice';
import { useGetTaskQuery } from 'api/ApiSlice';
import invert from 'invert-color';

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
function CoverEditor({ closeEditor, taskId }) {
  const { data: task } = useGetTaskQuery(taskId);
  const coverColorRef = useRef(null);

  const dispatch = useDispatch();
  const handleCoverColorUpdate = () => {
    const newCoverColor = coverColorRef.current.value;
    if (newCoverColor !== task.coverColor) {
      let newCoverTextColor = invert(newCoverColor, true);
      dispatch(handleCoverColorChange({ newCoverColor, newCoverTextColor }));
      dispatch(updateTask());
      dispatch(
        taskCoverColorUpdate({
          ...task,
          coverColor: newCoverColor,
          coverTextColor: newCoverTextColor,
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
      <ActionButton bgColor={'lightblue'} onClick={handleCoverColorUpdate}>
        Save
      </ActionButton>
    </>
  );
}

export default CoverEditor;
