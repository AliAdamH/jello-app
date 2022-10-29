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
  // const [data, setData] = useState(initialData);

  // const handleDragEnd = (result) => {
  //   const { destination, source, draggableId } = result;

  //   if (!destination) {
  //     return;
  //   }

  //   if (
  //     destination.index === source.index &&
  //     destination.droppableId === source.droppableId
  //   ) {
  //     return;
  //   }

  //   const column = data.columns[source.droppableId];
  //   const newTaskIds = Array.from(column.taskIds);
  //   newTaskIds.splice(source.index, 1);
  //   newTaskIds.splice(destination.index, 0, draggableId);

  //   const newColumn = {
  //     ...column,
  //     taskIds: newTaskIds,
  //   };

  //   const newData = {
  //     ...data,
  //     columns: {
  //       ...data.columns,
  //       [newColumn.id]: newColumn,
  //     },
  //   };

  //   setData(newData);
  // };

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
