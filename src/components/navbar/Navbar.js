import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const Header = styled.nav`
  background: radial-gradient(
    circle at 1.8% 4.8%,
    rgb(17, 23, 58) 0%,
    rgb(58, 85, 148) 90%
  );
  height: 64px;
  position: fixed;
  width: 100%;
  top: 0;
  color: white;
  display: flex;
  align-items: center;
`;

const Links = styled.ul`
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  margin-left: auto;

  > a {
    color: white;
  }
`;

const Brand = styled.p`
  font-size: 1.5rem;
  padding: 1rem;
`;

function Navbar() {
  return (
    <Header>
      <Brand>Jello</Brand>
      <Links>
        <Link to="/">Home</Link>
        <Link to="/board">Board</Link>
      </Links>
    </Header>
  );
}

export default Navbar;
