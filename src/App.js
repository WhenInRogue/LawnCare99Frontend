import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import SupplyPage from "./pages/SupplyPage";
import AddEditSupplyPage from "./pages/AddEditSupplyPage";
import CheckInSupplyPage from "./pages/CheckInSupplyPage";
import CheckOutSupplyPage from "./pages/CheckOutSupplyPage";
import SupplyTransactionsPage from "./pages/SupplyTransactionsPage";
import SupplyTransactionDetailsPage from "./pages/SupplyTransactionDetailsPage";
import EquipmentPage from "./pages/EquipmentPage";
import AddEditEquipmentPage from "./pages/AddEditEquipmentPage";
import CheckInEquipmentPage from "./pages/CheckInEquipmentPage";
import CheckOutEquipmentPage from "./pages/CheckOutEquipmentPage";
import EquipmentTransactionsPage from "./pages/EquipmentTransactionsPage";
import EquipmentTransactionDetailsPage from "./pages/EquipmentTransactionDetailsPage";
import StartMaintenancePage from "./pages/StartMaintenancePage";
import EndMaintenancePage from "./pages/EndMaintenancePage";
import MaintenanceRecordPage from "./pages/MaintenanceRecordPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        {/* ADMIN ROUTES */}
        <Route path="/supply" element={<AdminRoute element={<SupplyPage/>}/>}/>
        <Route path="/add-supply" element={<AdminRoute element={<AddEditSupplyPage/>}/>}/>
        <Route path="/edit-supply/:supplyId" element={<AdminRoute element={<AddEditSupplyPage/>}/>}/>

        <Route path="/equipment" element={<AdminRoute element={<EquipmentPage/>}/>}/>
        <Route path="/add-equipment" element={<AdminRoute element={<AddEditEquipmentPage/>}/>}/>
        <Route path="/edit-equipment/:equipmentId" element={<AdminRoute element={<AddEditEquipmentPage/>}/>}/>
        <Route path="/start-maintenance" element={<ProtectedRoute element={<StartMaintenancePage/>}/>}/>
        <Route path="/end-maintenance" element={<ProtectedRoute element={<EndMaintenancePage/>}/>}/>
        <Route path="/maintenanceRecords" element={<ProtectedRoute element={<MaintenanceRecordPage/>}/>}/>


          {/* ADMIN AND MANAGERS ROUTES */}
          <Route path="/checkInSupply" element={<ProtectedRoute element={<CheckInSupplyPage/>}/>}/>
          <Route path="/checkOutSupply" element={<ProtectedRoute element={<CheckOutSupplyPage/>}/>}/>
          <Route path="/supplyTransactions" element={<ProtectedRoute element={<SupplyTransactionsPage/>}/>}/>
          <Route path="/supplyTransactions/:supplyTransactionId" element={<ProtectedRoute element={<SupplyTransactionDetailsPage/>}/>}/>

          <Route path="/checkInEquipment" element={<ProtectedRoute element={<CheckInEquipmentPage/>}/>}/>
          <Route path="/checkOutEquipment" element={<ProtectedRoute element={<CheckOutEquipmentPage/>}/>}/>
          <Route path="/equipmentTransactions" element={<ProtectedRoute element={<EquipmentTransactionsPage/>}/>}/>
          <Route path="/equipmentTransactions/:equipmentTransactionId" element={<ProtectedRoute element={<EquipmentTransactionDetailsPage/>}/>}/>

          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage/>}/>}/>


          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage/>}/>}/>


          //catch-all route, redirects users to the login page when they enter an invalid path
          <Route path="*" element={<LoginPage/>}/>
        


        

      </Routes>
    </Router>
  )
}

export default App;
