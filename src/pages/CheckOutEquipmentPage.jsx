import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import CheckInTabs from "../component/CheckInTabs";

const CheckOutEquipmentPage = () => {
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
        showMessage(
          error.response?.data?.message || "Error fetching equipment: " + error
        );
      }
    };

    fetchEquipment();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!equipmentId || !totalHoursInput) {
      showMessage("Please fill in all required fields");
      return;
    }
    const body = {
      equipmentId,
      totalHoursInput: parseFloat(totalHoursInput),
      note,
    };

    try {
      const response = await ApiService.checkOutEquipment(body);
      showMessage(response.message);
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error checking out equipment: " + error
      );
    }
  };

  const resetForm = () => {
    setEquipmentId("");
    setNote("");
    setTotalHoursInput("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <div className="checkio-page">
        <CheckInTabs />
        {message && <div className="message in-page">{message}</div>}

        <section className="form-card">
          <header className="form-card-header">
            <div>
              <p className="eyebrow-text">Equipment</p>
              <h2>Check-Out Equipment</h2>
              <p className="subtitle-text">
                Release a piece of equipment for field usage and capture the total
                hours planned.
              </p>
            </div>
          </header>
          <form className="stacked-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select equipment</label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                required
              >
                <option value="">Select equipment</option>
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
                placeholder="Optional notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Total Hours</label>
              <input
                type="number"
                placeholder="Enter total hours"
                value={totalHoursInput}
                onChange={(e) => setTotalHoursInput(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              Check-Out Equipment
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default CheckOutEquipmentPage;
