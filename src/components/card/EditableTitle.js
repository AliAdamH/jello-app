import React, { useState } from 'react';
import styled from 'styled-components';

const TitleText = styled.h2`
  font-size: 1.5rem;
`;

const EditInput = styled.input`
  font-size: 1.25rem;
  padding-inline: 0.5rem;
  padding-block: 0.2rem;
  border: 1px solid lightgray;
`;

function EditableTitle(props) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const checkIfChanged = (e) => {
    if (e.target.value !== props.title) {
      props.handleTitleUpdate(e.target.value);
    }
    setIsBeingEdited(false);
  };

  return (
    <>
      <small>In column: {props.columnTitle}</small>
      {isBeingEdited ? (
        <EditInput
          autoFocus={true}
          type={'text'}
          defaultValue={props.title}
          onBlur={checkIfChanged}
        />
      ) : (
        <div>
          <TitleText onClick={() => setIsBeingEdited(true)}>
            {props.title}
          </TitleText>
        </div>
      )}
    </>
  );
}

export default EditableTitle;
