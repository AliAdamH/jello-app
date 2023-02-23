import React, { useState } from 'react';
import styled from 'styled-components';

const EditInput = styled.input`
  font-size: 1rem;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid lightgray;
`;

const Title = styled.h3`
  padding: 0.75rem;
  background-color: #eee;
`;

const Wrapper = styled.div`
  flex: 1;
`;

function EditableColumnTitle({ title, handleTitleUpdate }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const checkIfChanged = (e) => {
    if (e.target.value !== title) {
      handleTitleUpdate(e.target.value);
    }
    setIsBeingEdited(false);
  };

  return (
    <Wrapper>
      {isBeingEdited ? (
        <EditInput
          autoFocus={true}
          type={'text'}
          defaultValue={title}
          onBlur={checkIfChanged}
        />
      ) : (
        <Title onClick={() => setIsBeingEdited(true)}>{title}</Title>
      )}
    </Wrapper>
  );
}

export default EditableColumnTitle;
