import React from 'react';
import CoverEditor from './CoverEditor';
import TagsEditor from './TagsEditor';
import dueDateEditor from './DueDateEditor';
import styled from 'styled-components';

const EditorCloseButton = styled.button`
  margin-block: 0.25rem;
  margin-left: auto;
  padding-inline: 0.75rem;
  padding-block: 0.5rem;
  border-radius: 0.375rem;
  background-color: #eee;
`;
const sideEditorComponents = {
  cover: CoverEditor,
  tags: TagsEditor,
  dueDate: dueDateEditor,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

function SideEditor({ editorToRender, closeEditor, taskId }) {
  const ToRender = sideEditorComponents[editorToRender];
  return (
    <Container>
      <ToRender closeEditor={closeEditor} taskId={taskId} />
      <EditorCloseButton onClick={closeEditor}>Close</EditorCloseButton>
    </Container>
  );
}

export default SideEditor;
