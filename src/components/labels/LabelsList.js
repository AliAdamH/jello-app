import React from 'react';
import { FaTags } from 'react-icons/fa';
import styled from 'styled-components';
import FullLabel from './FullLabel';

const LabelListContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

function LabelsList({ labels }) {
  return (
    <>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaTags /> Labels
      </h3>
      <LabelListContainer>
        {Object.keys(labels).map((id, index) => {
          return <FullLabel key={id} label={labels[id]} />;
        })}
      </LabelListContainer>
    </>
  );
}

export default LabelsList;
