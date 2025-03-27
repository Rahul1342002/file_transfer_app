import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import { Router, Routes, Route } from 'react-router-dom';
import Send from './pages/send';
import Receive from './pages/receive';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
      </Routes>
    
  );
}

export default App;
