import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const EquipmentTransactionsPage = () => {
    const [equipmentTransactions, setEquipmentTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [equipmentTransactionFilter, setEquipmentTransactionFilter] = useState("");
    const [valueToSearch, setValueToSearch] = useState("");
    const navigate = useNavigate();

    //pagination Set-Up
    const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(0);
        const itemsPerPage = 10;

    useEffect(() => {
        const getEquipmentTransactions = async () => {
            try {
                const equipmentTransactionData = await ApiService.getAllEquipmentTransactions(valueToSearch);

                if (equipmentTransactionData.status === 200) {
                    setTotalPages(Math.ceil(equipmentTransactionData.equipmentTransactions.length / itemsPerPage));
                    setEquipmentTransactions(
                        equipmentTransactionData.equipmentTransactions.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                        )
                    );
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message ||
                    "Failed to fetch equipment transactions: " + error
                );
            }
        };
        getEquipmentTransactions();
    }, [currentPage, valueToSearch]);

    //Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

    //handle search
    const handleSearch = () =>{
    console.log("Searcxh hit")
    console.log("FILTER IS: " + equipmentTransactionFilter)
    setCurrentPage(1)
    setValueToSearch(equipmentTransactionFilter)
  }

    //Navigate to Transaction Details Page
    const navigateToEquipmentTransactionDetailsPage = (equipmentTransactionId) => {
        navigate(`/equipmentTransactions/${equipmentTransactionId}`);
    };

    return (
    <Layout>

      {message && <p className="message">{message}</p>}
      <div className="transactions-page">
        <div className="transactions-header">
            <h1>Equipment Transactions</h1>
            <div className="transaction-search">
                <input 
                placeholder="Search transaction ..."
                value={equipmentTransactionFilter}
                onChange={(e)=> setEquipmentTransactionFilter(e.target.value)}
                type="text" />
                <button onClick={()=> handleSearch()} > Search</button>
            </div>
        </div>

        {equipmentTransactions && 
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Total Hours</th>
                        <th>DATE</th>
                        <th>Note</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {equipmentTransactions.map((equipmentTransaction) => (
                        <tr key={equipmentTransaction.equipmentTransactionId}>
                            <td>{equipmentTransaction.equipmentTransactionType}</td>
                            <td>{equipmentTransaction.totalHoursInput}</td>
                            <td>{new Date(equipmentTransaction.createdAt).toLocaleString()}</td>
                            <td>{equipmentTransaction.note}</td>

                            <td>
                                <button onClick={()=> navigateToEquipmentTransactionDetailsPage(equipmentTransaction.equipmentTransactionId)}>View Details</button>
                            </td>
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
export default EquipmentTransactionsPage;