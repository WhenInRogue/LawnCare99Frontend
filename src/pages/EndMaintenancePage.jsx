import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const EndMaintenancePage = () => {
    const [equipment, setEquipment] = useState([]);
    const [equipmentId, setEquipmentId] = useState("");
    const [totalHoursInput, setTotalHoursInput] = useState("");
    const [maintenancePerformed, setMaintenancePerformed] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

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
    
        if (!equipmentId || !totalHoursInput || !maintenancePerformed) {
            showMesage("Please fill in all required fields");
            return
        }
        const body = {
            equipmentId,
            totalHoursInput: parseFloat(totalHoursInput),
            maintenancePerformed,
            note,
        };
        console.log(body)

        try {
            const response = await ApiService.endMaintenance(body);
            showMesage(response.message);
            resetForm();
        } catch (error) {
            showMesage(
                error.response?.data?.message || "Error ending maintenance: " + error
            );
        }
        
    };

    const resetForm = () => {
        setEquipmentId("");
        setTotalHoursInput("");
        setMaintenancePerformed("");
        setNote("");
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
        <h1>End Maintenance</h1>
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
            <label>Total Hours</label>
            <input
              type="number"
              value={totalHoursInput}
              onChange={(e) => setTotalHoursInput(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Maintenance Performed</label>
            <input
              type="text"
              value={maintenancePerformed}
              onChange={(e) => setMaintenancePerformed(e.target.value)}
              required
            />
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

          <button type="submit">End Maintenance</button>
        </form>
      </div>

      
    </Layout>
    );


};
export default EndMaintenancePage;