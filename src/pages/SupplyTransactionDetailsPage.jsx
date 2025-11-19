import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const SupplyTransactionDetailsPage = () => {
    const { supplyTransactionId } = useParams();
    const [supplyTransaction, setSupplyTransaction] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getSupplyTransaction = async () => {
            try {
                const supplyTransactionData = await ApiService.getSupplyTransactionById(supplyTransactionId);
                if (supplyTransactionData.status === 200) {
                setSupplyTransaction(supplyTransactionData.supplyTransaction);
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message ||
                    "Failed to fetch supply transaction details: " + error
                );
            }
        };

        getSupplyTransaction();
    }, [supplyTransactionId]);



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
        {supplyTransaction && (
           <>
           {/* Transaction base information */}
           <div className="section-card">
                <h2>Transaction Information</h2>
                <p>Type: {supplyTransaction.supplyTransactionType}</p>
                <p>Note: {supplyTransaction.note}</p>
                <p>Total Quantity: {supplyTransaction.quantity}</p>
                <p>Created At: {new Date(supplyTransaction.createdAt).toLocaleString()}</p>

           </div>

           {/* Supply information of the transaction */}
           <div className="section-card">
                <h2>Supply Information</h2>
                <p>Name: {supplyTransaction.supply.name}</p>
                <p>Unit of Measurement: {supplyTransaction.supply.unitOfMeasurement}</p>
                <p>Current Stock: {supplyTransaction.supply.currentStock}</p>
                <p>Reorder Level: {supplyTransaction.supply.reorderLevel}</p>
                <p>Maximum Quantity: {supplyTransaction.supply.maximumQuantity}</p>
                <p>Description: {supplyTransaction.supply.description}</p>
                
           </div>

           {/* User information who made the transaction */}
           <div className="section-card">
                <h2>User Information</h2>
                <p>Name: {supplyTransaction.user.name}</p>
                <p>Email: {supplyTransaction.user.email}</p>
                <p>Phone Number: {supplyTransaction.user.phoneNumber}</p>
                <p>Role: {supplyTransaction.user.role}</p>
                <p>Created At: {new Date(supplyTransaction.createdAt).toLocaleString()}</p>
           </div>


           </>
        )}
      </div>
    </Layout>
  );

}
export default SupplyTransactionDetailsPage;