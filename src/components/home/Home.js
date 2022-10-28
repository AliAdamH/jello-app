import React from 'react';
import styled from 'styled-components';
import BoardList from '../boardlist/BoardList';

const Container = styled.div`
  display: flex;
  width: 90%;
  background-color: limegreen;
  min-height: calc(100vh - 110px);
  padding: 0.5rem;
  margin-inline: auto;
`;

const SideBar = styled.aside`
  display: none;
  flex-direction: column;
  background-color: blue;
  width: 20%;

  @media (min-width: 40em) {
    display: flex;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
  margin-inline: 2rem;
  border-bottom: 2px solid lightgray;
`;

const BoardContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding-inline: 2rem;
  flex-wrap: wrap;
`;

function Home() {
  return (
    <Container>
      <SideBar>h</SideBar>
      <MainContent>
        <Title>Current Workspace Boards</Title>
        <BoardContainer>
          <BoardList />
        </BoardContainer>
      </MainContent>
    </Container>
  );
}

export default Home;
