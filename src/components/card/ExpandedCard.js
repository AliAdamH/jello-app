import React from 'react';
import styled from 'styled-components';
import EditableTitle from './EditableTitle';

const Expanded = styled.div`
  margin-inline: auto;
  margin-block: 2rem;
  border-radius: 0.375rem;
  background-color: #eee;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Cover = styled.div`
  height: 128px;
  border-radius: 0.375rem 0.375rem 0 0;
  background-color: red;
`;

const Body = styled.div`
  flex: 1;
`;

function ExpandedCard({ title }) {
  return (
    <>
      <Expanded>
        <Cover />
        <Body>
          <EditableTitle title={title} columnTitle={'Test Column Title'} />
        </Body>
      </Expanded>
    </>
  );
}

export default ExpandedCard;
