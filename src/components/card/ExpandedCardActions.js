import React from 'react';
import styled from 'styled-components';
import {
  FaUsers,
  FaImage,
  FaTags,
  FaClock,
  FaPaperclip,
  FaExchangeAlt,
  FaRobot,
} from 'react-icons/fa';

const CardAction = styled.button`
  padding-block: 0.5rem;
  padding-inline: 1rem;
  background-color: #ddd;
  transition: background-color 0.25s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.375rem;

  &:hover {
    background-color: #ccc;
  }
`;

const CardActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  gap: 0.625rem;
  padding: 1rem;
`;

function ExpandedCardActions({ openEditor }) {
  return (
    <CardActionContainer>
      <CardAction>
        <FaUsers /> Members
      </CardAction>
      <CardAction onClick={() => openEditor('cover')}>
        <FaImage /> Cover
      </CardAction>
      <CardAction onClick={() => openEditor('tags')}>
        <FaTags />
        Tags
      </CardAction>
      <CardAction>
        <FaClock />
        Dates
      </CardAction>
      <CardAction>
        <FaPaperclip />
        Files
      </CardAction>
      <CardAction>
        <FaExchangeAlt />
        Movements
      </CardAction>
      <CardAction>
        <FaRobot />
        Automation
      </CardAction>
    </CardActionContainer>
  );
}

export default ExpandedCardActions;
