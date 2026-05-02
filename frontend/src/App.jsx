import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;