import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const TextInput = styled.input`
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: none;
  border-bottom: 2px solid lightgray;
`;

const FormWrapper = styled.div`
  background-color: #eee;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 0.375rem;
  gap: 1rem;
  width: 320px;

  animation-name: potatoe;
  animation-duration: 0.7s;
  animation-timing-function: ease;

  @keyframes potatoe {
    from {
      transform: translateY(-10%);
    }
    to {
      transform: translateY(0%);
    }
  }
`;

const AddColumnButton = styled.button`
  border-radius: 0.375rem;
  padding-inline: 0.75rem;
  padding-block: 0.25rem;
  background-color: #0aa;
  color: white;
`;

const CancelButton = styled.button`
  border-radius: 0.375rem;
  padding-inline: 0.75rem;
  padding-block: 0.25rem;
  border: 0.15rem solid #0aa;
  color: #0aa;
`;

const FormActionWrapper = styled.div`
  display: flex;
  gap: 0.2rem;
  justify-content: flex-end;
`;

const FloatyButton = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.375rem;
  padding-inline: 1rem;
  padding-block: 0.75rem;
  width: 320px;
  color: white;
  text-align: left;
  transition: background-color 0.35s ease;
  &:hover {
    background-color: rgba(1, 1, 1, 0.5);
  }
`;

const NewColumn = ({ handleNewColumn }) => {
  const [addingIsActive, setAddingIsActive] = useState(false);
  const columnTitleField = useRef(null);

  const handleAddColumn = () => {
    handleNewColumn(columnTitleField.current.value);
    setAddingIsActive(false);
  };

  const handleFocusOut = (e) => {
    let inputValue = e.target.value;
    if (inputValue === null || inputValue.trim() === '') {
      setAddingIsActive(false);
    }
  };

  return addingIsActive ? (
    <FormWrapper>
      <TextInput
        ref={columnTitleField}
        onBlur={handleFocusOut}
        type={'text'}
        name="title"
        placeholder="Enter your column's title..."
      />
      <FormActionWrapper>
        <AddColumnButton onClick={handleAddColumn}>Add</AddColumnButton>
        <CancelButton onClick={() => setAddingIsActive(false)}>
          Cancel
        </CancelButton>
      </FormActionWrapper>
    </FormWrapper>
  ) : (
    <FloatyButton onClick={() => setAddingIsActive(true)}>
      + Add a new column
    </FloatyButton>
  );
};

export default NewColumn;
