import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const EquipmentTransactionDetailsPage = () => {
    const { equipmentTransactionId } = useParams();
    const [equipmentTransaction, setEquipmentTransaction] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getEquipmentTransaction = async () => {
            try {
                const equipmentTransactionData = await ApiService.getEquipmentTransactionById(equipmentTransactionId);
                if (equipmentTransactionData.status === 200) {
                setEquipmentTransaction(equipmentTransactionData.equipmentTransaction);
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message ||
                    "Failed to fetch equipment transaction details: " + error
                );
            }
        };

        getEquipmentTransaction();
    }, [equipmentTransactionId]);

    //Method to show message or errors
    const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return(
    <Layout>
        
      {message && <p className="message">{message}</p>}
      <div className="transaction-details-page">
        {equipmentTransaction && (
           <>
           {/* Transaction base information */}
           <div className="section-card">
                <h2>Transaction Information</h2>
                <p>Type: {equipmentTransaction.equipmentTransactionType}</p>
                <p>Note: {equipmentTransaction.note}</p>
                <p>Total Hours: {equipmentTransaction.totalHoursInput}</p>
                <p>Hours Logged: {equipmentTransaction.hoursLogged}</p>
                <p>Timestamp: {new Date(equipmentTransaction.timeStamp).toLocaleString()}</p>

           </div>

           {/* Equipment information of the transaction */}
           <div className="section-card">
                <h2>Equipment Information</h2>
                <p>Name: {equipmentTransaction.equipment.name}</p>
                <p>Total Hours: {equipmentTransaction.equipment.totalHoursInput}</p>
                <p>Equipment Status: {equipmentTransaction.equipment.equipmentStatus}</p>
                <p>Last Check-out Time: {new Date(equipmentTransaction.equipment.lastCheckOutTime).toLocaleString()}</p>
                <p>Description: {equipmentTransaction.equipment.description}</p>
                
           </div>

           {/* User information who made the transaction */}
           <div className="section-card">
                <h2>User Information</h2>
                <p>Name: {equipmentTransaction.user.name}</p>
                <p>Email: {equipmentTransaction.user.email}</p>
                <p>Phone Number: {equipmentTransaction.user.phoneNumber}</p>
                <p>Role: {equipmentTransaction.user.role}</p>
                <p>Created At: {new Date(equipmentTransaction.timestamp).toLocaleString()}</p>
           </div>


           </>
        )}
      </div>
    </Layout>
  );


};
export default EquipmentTransactionDetailsPage;