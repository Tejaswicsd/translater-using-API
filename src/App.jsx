import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <nav className="mb-6 space-x-4">
          <Link to="/">Flashcards</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/chatbot">Chatbot</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;