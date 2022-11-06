import { useState } from 'react';
import './App.css';
import initialData from './initial-data';
import { ExampleResult } from './example-result';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Board from './components/board/Board';
import Navbar from './components/navbar/Navbar';

import styled from 'styled-components';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </div>
  );
}

export default App;
