import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import SupplyPage from "./pages/SupplyPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        {/* ADMIN ROUTES */}
        <Route path="/supply" element={<AdminRoute element={<SupplyPage/>}/>}/>


          {/* ADMIN AND MANAGERS ROUTES */}


          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>}/>
          {/* <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage/>}/>}/> */}


          //catch-all route, redirects users to the login page when they enter an invalid path
          <Route path="*" element={<LoginPage/>}/>
        


        

      </Routes>
    </Router>
  )
}

export default App;
