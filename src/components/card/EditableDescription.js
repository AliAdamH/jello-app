import React, { useState } from 'react';
import styled from 'styled-components';
import { FaAlignJustify } from 'react-icons/fa';
const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DescriptionField = styled.textarea`
  resize: none;
  height: 128px;
  border: none;
  width: 100%;
`;

const ActionButton = styled.button`
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
  border-radius: 0.375rem;
  background-color: ${(props) => props.bgColor};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

function EditableDescription({ description }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const handleSubmit = () => {
    return null;
  };

  return (
    <>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaAlignJustify /> Description
      </h3>
      {isBeingEdited || !description ? (
        <StyledForm onSubmit={handleSubmit}>
          <DescriptionField
            defaultValue={description === null ? '' : description}
            name="description"
          />
          <FormActions>
            <ActionButton bgColor={'#4ef037'}>Submit</ActionButton>
            <ActionButton bgColor={'#ddd'}>Cancel</ActionButton>
          </FormActions>
        </StyledForm>
      ) : (
        <>
          <p>{description}</p>
          <ActionButton bgColor={'#ddd'}> Edit </ActionButton>
        </>
      )}
    </>
  );
}

export default EditableDescription;
