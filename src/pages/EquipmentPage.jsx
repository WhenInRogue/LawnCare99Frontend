import React, { useState, useEffect, useMemo } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const EquipmentPage = () => {
    const [allEquipment, setAllEquipment] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [message, setMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const navigate = useNavigate();

    //Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

    useEffect(() => {
        const getEquipment = async () => {
            try {
                const equipmentData = await ApiService.getAllEquipment();

                if (equipmentData.status === 200) {
                    setAllEquipment(equipmentData.equipments);
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error Getting Equipment: " + error
                );
            }
        };
        getEquipment();
    }, []);

    useEffect(() => {
        const filteredEquipment =
            statusFilter === "ALL"
                ? allEquipment
                : allEquipment.filter(
                      (equipmentItem) => equipmentItem.equipmentStatus === statusFilter
                  );

        const calculatedTotalPages = Math.ceil(filteredEquipment.length / itemsPerPage) || 0;
        setTotalPages(calculatedTotalPages);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedEquipment = filteredEquipment.slice(
            startIndex,
            startIndex + itemsPerPage
        );

        setEquipment(paginatedEquipment);
    }, [allEquipment, statusFilter, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const statusOptions = useMemo(() => {
        const uniqueStatuses = Array.from(
            new Set(allEquipment.map((equipmentItem) => equipmentItem.equipmentStatus).filter(Boolean))
        );
        return uniqueStatuses.sort();
    }, [allEquipment]);

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
                <div className="product-actions-row">
                    <div className="product-filter">
                        <label htmlFor="status-filter">Filter by status</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All statuses</option>
                            {statusOptions.map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                    {statusOption}
                                </option>
                            ))}
                        </select>
                    </div>
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
                      <div key={equipment.equipmentId} className="product-item">
                          <div className="product-info">
                            <h3 className="name">{equipment.name}</h3>
                            <p className="totalHours">Total Hours: {equipment.totalHours}</p>
                            <p className="maintenanceIntervalHours">Maintenance Interval: {equipment.maintenanceIntervalHours}</p>
                            <p className="status">Current Status: {equipment.equipmentStatus}</p>
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