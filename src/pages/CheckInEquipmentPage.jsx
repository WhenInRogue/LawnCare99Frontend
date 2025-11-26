import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const CheckInEquipmentPage = () => {
    const [equipment, setEquipment] = useState([]);
    const [equipmentId, setEquipmentId] = useState("");
    const [note, setNote] = useState("");
    const [totalHoursInput, setTotalHoursInput] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const equipmentData = await ApiService.getAllEquipment();
                setEquipment(equipmentData.equipments);
            } catch (error) {
                showMesage(
                    error.response?.data?.message || "Error fetching equipment: " + error
                );
            }
        };
        fetchEquipment();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!equipmentId || !totalHoursInput) {
            showMesage("Please fill in all required fields");
            return
        }
        const body = {
            equipmentId,
            totalHoursInput: parseFloat(totalHoursInput),
            note,
        };
        console.log(body)

        try {
            const response = await ApiService.checkInEquipment(body);
            showMesage(response.message);
            resetForm();
        } catch (error) {
            showMesage(
                error.response?.data?.message || "Error checking in equipment: " + error
            );
        }
        
    };

    const resetForm = () => {
        setEquipmentId("");
        setNote("");
        setTotalHoursInput("");
    };

    //Methods to show message or errors
    const showMesage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="purchase-form-page">
        <h1>Check-In Equipment</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select equipment</label>

            <select
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              required
            >
              <option value="">Select an equipment</option>
              {equipment.map((equip) => (
                <option key={equip.equipmentId} value={equip.equipmentId}>
                  {equip.name}
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
            <label>Total Hours</label>
            <input
              type="number"
              value={totalHoursInput}
              onChange={(e) => setTotalHoursInput(e.target.value)}
              required
            />
          </div>

          <button type="submit">Check-In Equipment</button>
        </form>
      </div>
    </Layout>
    );

};
export default CheckInEquipmentPage;