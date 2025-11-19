import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const SupplyTransactionsPage = () => {
    const [supplyTransactions, setSupplyTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("");
    const [valueToSearch, setValueToSearch] = useState("");

    const navigate = useNavigate();

    //pagination Set-Up
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const getSupplyTransactions = async () => {
            try {
                const supplyTransactionData = await ApiService.getAllSupplyTransactions(valueToSearch);

                if (supplyTransactionData.status === 200) {
                    setTotalPages(Math.ceil(supplyTransactionData.supplyTransactions.length / itemsPerPage));

                    setSupplyTransactions(
                        supplyTransactionData.supplyTransactions.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                        )
                    );
                }
            } catch (error) {
                showMessage(
                    error.response?.data?.message ||
                    "Failed to fetch supply transactions: " + error
                );
            }
        };

        getSupplyTransactions();
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
    console.log("FILTER IS: " + filter)
    setCurrentPage(1)
    setValueToSearch(filter)
  }

  //Navigate to Transaction Details Page
  const navigateToSupplyTransactionDetailsPage = (supplyTransactionId) => {
    navigate(`/supplyTransactions/${supplyTransactionId}`);
  }

  return (
    <Layout>

      {message && <p className="message">{message}</p>}
      <div className="transactions-page">
        <div className="transactions-header">
            <h1>Supply Transactions</h1>
            <div className="transaction-search">
                <input 
                placeholder="Search transaction ..."
                value={filter}
                onChange={(e)=> setFilter(e.target.value)}
                type="text" />
                <button onClick={()=> handleSearch()} > Search</button>
            </div>
        </div>

        {supplyTransactions && 
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>DATE</th>
                        <th>Note</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {supplyTransactions.map((supplyTransaction) => (
                        <tr key={supplyTransaction.supplyTransactionId}>
                            <td>{supplyTransaction.supplyTransactionType}</td>
                            <td>{supplyTransaction.quantity}</td>
                            <td>{new Date(supplyTransaction.createdAt).toLocaleString()}</td>
                            <td>{supplyTransaction.note}</td>

                            <td>
                                <button onClick={()=> navigateToSupplyTransactionDetailsPage(supplyTransaction.supplyTransactionId)}>View Details</button>
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

export default SupplyTransactionsPage;