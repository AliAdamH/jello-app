import React, { useRef, useState } from 'react';
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
  const initialTitle = useRef(props.title);

  const checkIfChanged = (e) => {
    if (e.target.value === initialTitle.current) {
      console.log('SAME TITLE!');
    } else {
      console.log('YOU HAVE CHANGED THE TITLE');
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
          defaultValue={initialTitle.current}
          onBlur={checkIfChanged}
        />
      ) : (
        <div>
          <TitleText onClick={() => setIsBeingEdited(true)}>
            {initialTitle.current}
          </TitleText>
        </div>
      )}
    </>
  );
}

export default EditableTitle;
