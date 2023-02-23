import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const ExampleBoard = styled.div`
  height: 128px;
  width: 192px;
  background-color: white;
  border-radius: 0.375rem;
`;

function BoardList() {
  return (
    <>
      <Link to="/board">
        <ExampleBoard></ExampleBoard>
      </Link>
      <ExampleBoard></ExampleBoard>
      <ExampleBoard></ExampleBoard>
      <ExampleBoard></ExampleBoard>
      <ExampleBoard></ExampleBoard>
      <ExampleBoard></ExampleBoard>
    </>
  );
}

export default BoardList;
