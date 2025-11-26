import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditEquipmentPage = () => {
    const { equipmentId} = useParams("");
    const [name, setName] = useState("");
    const [totalHours, setTotalHours] = useState("");
    const [equipmentStatus, setEquipmentStatus] = useState(null);
    const [lastCheckOutTime, setLastCheckOutTime] = useState("");
    const [maintenanceIntervalHours, setMaintenanceIntervalHours] = useState("");
    const [description, setDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEquipmentById = async () => {
            if (equipmentId) {
                setIsEditing(true);
                try {
                  const equipmentData = await ApiService.getEquipmentById(equipmentId);
                    if (equipmentData.status === 200) {
                        setName(equipmentData.equipment.name);
                        setTotalHours(equipmentData.equipment.totalHours);
                        setEquipmentStatus(equipmentData.equipment.equipmentStatus);
                        setLastCheckOutTime(equipmentData.equipment.lastCheckOutTime);
                        setMaintenanceIntervalHours(equipmentData.equipment.maintenanceIntervalHours);
                        setDescription(equipmentData.equipment.description);
                    } else {
                        showMessage(equipmentData.message);
                    }
                } catch (error) {
                    showMessage(
                        error.response?.data?.message || 
                        "Error fetching equipment by Id: " + error
                    );
                }
            }
        };
        if (equipmentId) fetchEquipmentById();
    }, [equipmentId]);

    //method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const equipmentData = {
        name,
        totalHours,
        equipmentStatus,
        lastCheckOutTime,
        maintenanceIntervalHours,
        description
    };

    try {
        if (isEditing) {
            await ApiService.updateEquipment(equipmentId, equipmentData);
            showMessage("Equipment updated successfully!");
        } else {
            await ApiService.createEquipment(equipmentData);
            showMessage("Equipment added successfully!");
        }
        navigate("/equipment");
    } catch (error) {
        showMessage(
            error.response?.data?.message || 
            "Error saving equipment data: " + error
        );
    }

    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="product-form-page">
                <h1>{isEditing ? "Edit Equipment" : "Add Equipment"}</h1>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Equipment Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Total Hours</label>
                        <input
                            type="text"
                            value={totalHours}
                            onChange={(e) => setTotalHours(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Maintenance Interval (Hours)</label>
                        <input
                            type="text"
                            value={maintenanceIntervalHours}
                            onChange={(e) => setMaintenanceIntervalHours(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit">{isEditing ? "Edit Equipment" : "Add Equipment"}</button>
                    
                </form>
            </div>
        </Layout>
    );


};
export default AddEditEquipmentPage;