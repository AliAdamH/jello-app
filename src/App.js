import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/dashboard/Home';
import Board from './pages/board/Board';
import Navbar from './layout/Navbar';

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
