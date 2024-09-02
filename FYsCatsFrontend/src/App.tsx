import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Homepage from './pages/homepage'
import './index.css'
import Navbar from "./components/navbar";
import Login from "./pages/loginPage";
import Aboutus from "./pages/aboutuspage";
import Fullcollection from "./pages/fullcollectionpage";
import { AuthProvider } from "./components/authContext";
import { UserProvider } from './components/adminContext';
import ResetPassword from "./pages/resetPasswordPage";


function App() {
  const [homeFirstRender, setHomeFirstRender] = useState(true)
  let location = useLocation();
  return (
    <div className="App">
        {location.pathname !== '/admin/resetPassword' && <Navbar setHomeFirstRender={setHomeFirstRender}/>}
      <Routes>
        <Route path="/" element={<Homepage homeFirstRender={homeFirstRender} setHomeFirstRender={setHomeFirstRender}/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/aboutus" element={<Aboutus/>}/>
        <Route path="/fullCollection" element={<Fullcollection/>}/>
        <Route path="/admin/resetPassword" element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

function AppWrapper() {
  return (
    <UserProvider>
      <AuthProvider>
        <Router>
            <App/>
        </Router>
      </AuthProvider>
    </UserProvider>
  )
}

export default AppWrapper
