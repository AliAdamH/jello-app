import React, { useState } from 'react';
import { Box, Heading, Input } from '@chakra-ui/react';

function EditableColumnTitle({ title, handleTitleUpdate }) {
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const checkIfChanged = (e) => {
    if (e.target.value !== title) {
      handleTitleUpdate(e.target.value);
    }
    setIsBeingEdited(false);
  };

  return (
    <Box flex={1} p={4}>
      {isBeingEdited ? (
        <Input
          p={1}
          autoFocus={true}
          type={'text'}
          defaultValue={title}
          onBlur={checkIfChanged}
        />
      ) : (
        <Heading
          fontSize={'lg'}
          as={'h3'}
          onClick={() => setIsBeingEdited(true)}
        >
          {title}
        </Heading>
      )}
    </Box>
  );
}

export default EditableColumnTitle;
