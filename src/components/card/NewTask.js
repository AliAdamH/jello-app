import React, { useRef } from 'react';
import styled from 'styled-components';

const TaskTitleField = styled.textarea`
  padding: 0.5rem;
  min-height: 3rem;
  border: none;
  resize: none;
  border-radius: 0.375rem;
`;
const NewTaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.625rem;
  justify-content: flex-end;
  padding: 0.5rem;
`;

const AddNewTaskButton = styled.button`
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  border-radius: 0.375rem;
  color: white;
  background-color: #0aa;
`;

const CancelTaskButton = styled.button`
  padding: 0.5rem;
  color: #0aa;
  border: 2px solid #0aa;
  border-radius: 0.375rem;
`;

const NewTask = ({ handleFocusOutOfNewTask, handleTaskCreation }) => {
  const textFieldRef = useRef(null);

  const handleFocusOut = (e) => {
    let inputValue = e.target.value;
    if (inputValue === null || inputValue.trim() === '') {
      handleFocusOutOfNewTask();
    }
  };

  const passTaskParams = () => {
    handleTaskCreation(textFieldRef.current.value);
  };

  return (
    <NewTaskContainer>
      <TaskTitleField
        onBlur={handleFocusOut}
        autoFocus={true}
        ref={textFieldRef}
      ></TaskTitleField>
      <ButtonWrapper>
        <AddNewTaskButton onClick={passTaskParams}>Add</AddNewTaskButton>
        <CancelTaskButton onClick={handleFocusOutOfNewTask}>
          Cancel
        </CancelTaskButton>
      </ButtonWrapper>
    </NewTaskContainer>
  );
};

export default NewTask;
