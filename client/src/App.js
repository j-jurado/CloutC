import Login from './components/Login';
import Score from './components/Score';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/score" element={<Score />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
