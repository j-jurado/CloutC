import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from "react";
import Login from './components/Login';
import Score from './components/Score';
import './App.css';

function App() {
  
  const [user, setUser] = useState(null);
  
  return (
    <Router>
      <Routes>
        {!user && (
        <Route path="/" element={<Login authorize={()=> setUser(true)} />} />
        )}
        {user && (
        <Route path="/score" element={<Score authorize={()=> setUser(false)} />} />
        )}
        <Route path="*" element={<Navigate to={user ? "/score": "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
