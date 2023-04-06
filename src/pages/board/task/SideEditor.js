import React from 'react';
import CoverEditor from './CoverEditor';
import TagsEditor from './TagsEditor';
import dueDateEditor from './DueDateEditor';
import styled from 'styled-components';
import { CloseButton, Flex } from '@chakra-ui/react';

const sideEditorComponents = {
  cover: CoverEditor,
  tags: TagsEditor,
  dueDate: dueDateEditor,
};

function SideEditor({ editorToRender, closeEditor, taskId, boardId }) {
  const ToRender = sideEditorComponents[editorToRender];
  return (
    <Flex direction="column" gap={1} position="relative">
      <CloseButton size="md" onClick={closeEditor} ml="auto" />
      <ToRender closeEditor={closeEditor} taskId={taskId} boardId={boardId} />
    </Flex>
  );
}

export default SideEditor;
