import React, { useRef } from 'react';
import { useGetTaskQuery, useUpdateTaskDataMutation } from 'api/ApiSlice';
import invert from 'invert-color';
import { Flex, Text, Button, chakra } from '@chakra-ui/react';

const CustomColorInput = chakra('input', {
  baseStyle: {
    appearance: 'none',
    MozAppearance: 'none',
    WebkitAppearance: 'none',
    background: 'none',
    border: 0,
    cursor: 'pointer',
    height: '5rem',
    width: '5rem',
    marginInline: 'auto',
    padding: 0,
  },
});

function CoverEditor({ closeEditor, taskId, boardId }) {
  const { data: task } = useGetTaskQuery(taskId);
  const [taskDataMutation] = useUpdateTaskDataMutation();
  const coverColorRef = useRef(null);

  const handleCoverColorUpdate = () => {
    const newCoverColor = coverColorRef.current.value;
    if (newCoverColor !== task.coverColor) {
      let newCoverTextColor = invert(newCoverColor, true);
      taskDataMutation({
        task: {
          ...task,
          coverColor: newCoverColor,
          coverTextColor: newCoverTextColor,
        },
        boardId,
      });
    }
    closeEditor();
  };

  return (
    <Flex direction="column" gap={4}>
      <Text mx="auto" py={2} borderBottom="3px solid" borderColor={'gray.200'}>
        Choose a new color for your card
      </Text>
      <CustomColorInput
        ref={coverColorRef}
        type={'color'}
        defaultValue={task.coverColor}
      />
      <Button bg="green.400" onClick={handleCoverColorUpdate}>
        Save
      </Button>
    </Flex>
  );
}

export default CoverEditor;
