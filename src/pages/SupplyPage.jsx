import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const SupplyPage = () => {
    const [supplies, setSupplies] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    //Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getSupplies = async () => {
        try {
            const supplyData = await ApiService.getAllSupplies();

            if (supplyData.status === 200) {
                setTotalPages(Math.ceil(supplyData.supplies.length / itemsPerPage));

                setSupplies(
                    supplyData.supplies.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    )
                );
            }
        } catch (error) {
            showMessage(
                error.response?.data?.message || "Error Getting Supplies: " + error
            );
        }
    };

    getSupplies();
  }, [currentPage]);

  //Delete a Supply
  const handleDeleteSupply = async (supplyId) => {
    if (window.confirm("Are you sure you want to delete this Supply?")) {
        try {
            await ApiService.deleteSupply(supplyId);
            showMessage("Supply sucessfully deleted");
            window.location.reload(); //reload page
        } catch (error) {
            showMessage(
                error.response?.data?.message ||
                "Error deleting supply: " + error
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
                <h1>Supplies</h1>
                <button
                  className="add-product-btn"
                  onClick={() => navigate("/add-supply")}
                  >
                    Add Supply
                  </button>
            </div>

            {supplies && (
                <div className="product-list">
                    {supplies.map((supply) => (
                                    //does this need to be supplyID?
                      <div key={supply.supplyId} className="product-item">

                          <div className="product-info">
                            <h3 className="name">{supply.name}</h3>
                            <p className="unitOfMeasurement">Unit Type: {supply.unitOfMeasurement}</p>
                            <p className="currentStock">Current Stock: {supply.currentStock}</p>
                            <p className="reorderLevel">Reorder Level: {supply.reorderLevel}</p>
                            <p className="maximumQuantity">Max Quantity: {supply.maximumQuantity}</p>
                          </div>

                          <div className="product-actions">
                            <button className="edit-btn" onClick={()=> navigate(`/edit-supply/${supply.supplyId}`)}>Edit</button>
                            <button  className="delete-btn" onClick={()=> handleDeleteSupply(supply.supplyId)}>Delete</button>
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
export default SupplyPage;