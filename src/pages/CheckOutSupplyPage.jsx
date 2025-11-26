import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const CheckOutSupplyPage = () => {
    const [supplies, setSupplies] = useState([]);
    const [supplyId, setSupplyId] = useState("");
    const [note, setNote] = useState("");
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
            const fetchSupplies = async () => {
                try {
                    const supplyData = await ApiService.getAllSupplies();
                    setSupplies(supplyData.supplies);
                } catch (error) {
                    showMesage(
                        error.response?.data?.message || "Error fetching supplies: " + error
                    );
                }
            };
    
            fetchSupplies();
        }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
        
            if (!supplyId || !quantity) {
                showMesage("Please fill in all required fields");
                return
            }
            const body = {
                supplyId,
                quantity: parseInt(quantity),
                note,
            };
            console.log(body)
        
            try {
                const response = await ApiService.checkOutSupply(body);
                showMesage(response.message);
                resetForm();
            } catch (error) {
                showMesage(
                    error.response?.data?.message || "Error checking out supply: " + error
                );
            }
        };

    const resetForm = () => {
        setSupplyId("");
        setNote("");
        setQuantity("");
    };

    //Methods to show message or errors
    const showMesage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

     //Navigate to Check-Out Equipment Page
    const navigateToCheckOutEquipmentPage = () => {
    navigate(`/checkOutEquipment`);
    }

    return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="purchase-form-page">
        <h1>Check-Out Supply</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select supply</label>

            <select
              value={supplyId}
              onChange={(e) => setSupplyId(e.target.value)}
              required
            >
              <option value="">Select a supply</option>
              {supplies.map((supply) => (
                <option key={supply.supplyId} value={supply.supplyId}>
                  {supply.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <button type="submit">Check-Out Supply</button>
        </form>
      </div>

      <div className="checkin-equipment-btn-container">
        <button onClick={navigateToCheckOutEquipmentPage}>Check-Out Equipment</button>
      </div>

    </Layout>
    );

};
export default CheckOutSupplyPage;