import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const MaintenanceRecordPage = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [message, setMessage] = useState("");
    const [navigate] = useNavigate();

    //pagination Set-up
    const [currentPage, setCurrentPage] = useState(1);
            const [totalPages, setTotalPages] = useState(0);
            const itemsPerPage = 10;

    useEffect(() => {
        const getMaintenanceRecords = async () => {
            try {
                const maintenanceRecordData = await ApiService.getAllMaintenanceRecords();

                if (maintenanceRecordData.status === 200) {
                    setTotalPages(Math.ceil(maintenanceRecordData.maintenanceRecords.length / itemsPerPage));
                    setMaintenanceRecords(
                        maintenanceRecordData.maintenanceRecords.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                        )
                    );
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message || "Error fetching maintenance records: " + error
                );
            }
        };
        getMaintenanceRecords();
    }, [currentPage]);

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