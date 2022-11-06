import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const TitleText = styled.h2`
  padding: 1rem;
  font-size: 1.125rem;
`;

function EditableTitle(props) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(props.title);
  const watchInput = (e) => {
    console.log(e);
    setUpdatedTitle(e.target.value);
  };

  return (
    <>
      {isBeingEdited ? (
        <input type={'text'} value={updatedTitle} onKeyUp={watchInput} />
      ) : (
        <TitleText onClick={() => setIsBeingEdited(true)}>
          {updatedTitle}
        </TitleText>
      )}
      <small
        style={{
          marginLeft: '1rem',
        }}
      >
        In column: {props.columnTitle}
      </small>
    </>
  );
}

export default EditableTitle;
