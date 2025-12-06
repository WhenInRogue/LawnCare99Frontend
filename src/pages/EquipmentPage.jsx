import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const equipmentStatusOptions = ["AVAILABLE", "IN_USE", "MAINTENANCE"];

const EquipmentPage = () => {
    const [equipment, setEquipment] = useState([]);
    const [message, setMessage] = useState("");
    const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("");

    const navigate = useNavigate();

    //Pagination Set-Up
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const getEquipment = async () => {
            try {
                const equipmentData = await ApiService.getAllEquipment(equipmentStatusFilter || undefined);

                if (equipmentData.status === 200) {
                    const records = equipmentData.equipments || [];
                    setTotalPages(Math.ceil(records.length / itemsPerPage));

                    setEquipment(
                        records.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )
                    );
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error Getting Equipment: " + error
                );
            }
        };
        getEquipment();
    }, [currentPage, equipmentStatusFilter]);

    //Delete Equipment
    const handleDeleteEquipment = async (equipmentId) => {
        if (window.confirm("Are you sure you want to delete this Equipment?")) {
            try {
                await ApiService.deleteEquipment(equipmentId);
                showMessage("Equipment sucessfully deleted");
                window.location.reload(); //reload page
            } catch (error) {
                showMessage(
                    error.response?.data?.message ||
                    "Error deleting equipment: " + error
                );
            }
        }
    
    };

    //method to show message or errors
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    //Layout
  return (
    <Layout>
        {message && <div className="message">{message}</div>}

        <div className="product-page">
            <div className="product-header">
                <h1>Equipment</h1>
                <div className="product-header-actions">
                    <select
                        className="status-filter"
                        value={equipmentStatusFilter}
                        onChange={(e) => {
                            setEquipmentStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All</option>
                        {equipmentStatusOptions.map((equipmentStatus) => (
                            <option key={equipmentStatus} value={equipmentStatus}>
                                {equipmentStatus.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                    <button
                        className="add-product-btn"
                        onClick={() => navigate("/add-equipment")}
                    >
                        Add Equipment
                    </button>
                </div>
            </div>

            {equipment && (
                <div className="product-list">
                    {equipment.map((equipment) => (
                      <div
                        key={equipment.equipmentId}
                        className={`product-item${equipment.maintenanceDue ? " maintenance-due" : ""}`}
                      >
                          <div className="product-info">
                            <h3 className="name">{equipment.name}</h3>
                            <p className="totalHours">Total Hours: {equipment.totalHours}</p>
                            <p className="maintenanceIntervalHours">Maintenance Interval: {equipment.maintenanceIntervalHours}</p>
                            <p className="status">Current Status: {equipment.equipmentStatus}</p>
                            <p className="maintenanceDue">Is Maintenance Due?: {equipment.maintenanceDue ? "Yes" : "No"}</p>
                            <p className="nextMaintenanceDueHours">Next Maintenance Due At: {equipment.nextMaintenanceDueHours}</p>
                            <p className="lastCheckOutTime">Last Check-Out: {equipment.lastCheckOutTime}</p>
                          </div>

                          <div className="product-actions">
                            <button className="edit-btn" onClick={()=> navigate(`/edit-equipment/${equipment.equipmentId}`)}>Edit</button>
                            <button  className="delete-btn" onClick={()=> handleDeleteEquipment(equipment.equipmentId)}>Delete</button>
                          </div>

                      </div>
                    ))}
                </div>
            )}
        </div>

        <PaginationComponent
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      />
    </Layout>
  );


};
export default EquipmentPage;