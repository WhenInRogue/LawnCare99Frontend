import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        {/* ADMIN ROUTES */}


          {/* ADMIN AND MANAGERS ROUTES */}


          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>}/>


          //catch-all route, redirects users to the login page when they enter an invalid path
          <Route path="*" element={<LoginPage/>}/>
        


        

      </Routes>
    </Router>
  )
}

export default App;
