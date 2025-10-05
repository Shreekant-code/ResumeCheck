import { Home } from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import { Signup } from "./Pages/Signup";
import { AuthProvider } from "./Context/Authtoken";
import { Analysis } from "./Pages/Analysis";

const App = () => {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analysis" element={<Analysis />}/>
      </Routes>
   
  );
};

export default App;

