import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const MaintenanceRecordPage = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [message, setMessage] = useState("");
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
    
    const navigate = useNavigate();

    //pagination Set-up
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const equipmentData = await ApiService.getAllEquipment();

                if (equipmentData.status === 200) {
                    setEquipmentOptions(equipmentData.equipments || []);
                } else {
                    showMessage(equipmentData.message || "Unable to load equipment");
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error fetching equipment list: " + error
                );
            }
        };
        fetchEquipment();
    }, []);

    useEffect(() => {
        const getMaintenanceRecords = async () => {
            try {
                let maintenanceRecordData;

                if (selectedEquipmentId) {
                    maintenanceRecordData = await ApiService.getMaintenanceRecordsByEquipment(selectedEquipmentId);
                } else {
                    maintenanceRecordData = await ApiService.getAllMaintenanceRecords();
                }

                if (maintenanceRecordData.status === 200) {
                    const records = maintenanceRecordData.maintenanceRecords || [];
                    setTotalPages(Math.ceil(records.length / itemsPerPage));
                    setMaintenanceRecords(
                        records.slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                        )
                    );
                } else {
                    showMessage(maintenanceRecordData.message || "Unable to load maintenance records");
                    setMaintenanceRecords([]);
                    setTotalPages(0);
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error fetching maintenance records: " + error
                );
                setMaintenanceRecords([]);
                setTotalPages(0);
            }
        };
        getMaintenanceRecords();
    }, [currentPage, selectedEquipmentId]);

    //Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>

      {message && <p className="message">{message}</p>}
      <div className="transactions-page">
        <div className="transactions-header">
            <h1>Maintenance Records</h1>
            <div className="transactions-header-actions">
                <select
                    value={selectedEquipmentId}
                    onChange={(e) => {
                        setSelectedEquipmentId(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Equipment</option>
                    {equipmentOptions.map((equipment) => (
                        <option key={equipment.equipmentId} value={equipment.equipmentId}>
                            {equipment.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        {maintenanceRecords && 
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>Maintenance Performed</th>
                        <th>Note</th>
                        <th>Total Hours When Maintenance Was Performed</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {maintenanceRecords.map((maintenanceRecord) => (
                        <tr key={maintenanceRecord.equipmentTransactionId}>
                            <td>{maintenanceRecord.maintenancePerformed}</td>
                            <td>{maintenanceRecord.note}</td>
                            <td>{maintenanceRecord.totalHoursAtMaintenance}</td>
                            <td>{new Date(maintenanceRecord.performedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        }
      </div>


      <PaginationComponent
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      />
    </Layout>
  );
  
};

export default MaintenanceRecordPage;