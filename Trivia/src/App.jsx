import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Intro from "./Pages/Intro";
import Gk from "./Pages/Gk";
import Sports from "./Pages/Sports";
import Cpp from "./Pages/Cpp";
import Java from "./Pages/Java";
import Css from "./Pages/Css";
import TriviaQuiz from "./TriviaQuiz";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gk" element={<Gk />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/cpp" element={<Cpp />} />
        <Route path="/css" element={<Css />} />
        <Route path="/java" element={<Java />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
