import {Home} from "./Components/Home"
import {  Router, Routes, Route } from "react-router-dom";

const App=()=>{
  return(
    <>


  <Home />   

  <Routes>
    <Route path="/signup" element={<h1>Sign up form</h1>} />
  </Routes>
    </>
  )
}

export default App
