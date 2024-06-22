import {
	Routes,
	Route,
} from "react-router-dom";
import CreateAccount from './Pages/CreateAccount/CreateAccount';
import Login from "./Pages/Login/Login";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Home from './Pages/Home/Home'
import Flashcards from "./Pages/Flashcards/Flashcards";
import DataVisualisation from "./Pages/DataVisualisation/DataVisualisation";
import Notes from "./Pages/Notes/Notes";
import Timer from "./Pages/Timer/Timer";
import Repository from "./Pages/Repository/Repository";
import NotFound from "./Pages/NotFound/NotFound.js";

function App() {
  return (
    <>
      <Routes>
        <Route path="/olsa/" element={<Home />} />
        <Route path="/olsa/landing-page" element={<LandingPage />} />
        <Route path="/olsa/create-account" element={<CreateAccount/>} />
        <Route path="/olsa/login" element={<Login/>} />
        <Route path="/olsa/flashcards" element={<Flashcards/>} />
        <Route path="/olsa/schedule" element={<DataVisualisation/>} />
        <Route path="/olsa/notes" element={<Notes/>} />
        <Route path="/olsa/repository" element={<Repository/>} />
        <Route path="/olsa/timer" element={<Timer/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
