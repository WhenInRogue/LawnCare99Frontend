import React, { useState, useEffect, useMemo } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const SupplyPage = () => {
  const [allSupplies, setAllSupplies] = useState([]);
  const [paginatedSupplies, setPaginatedSupplies] = useState([]);
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
                const supplyList = supplyData.supplies || [];
                setAllSupplies(supplyList);
                setTotalPages(
                  Math.max(Math.ceil(supplyList.length / itemsPerPage), 1)
                );

                setPaginatedSupplies(
                    supplyList.slice(
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

  const supplyStats = useMemo(() => {
    const total = allSupplies.length;
    const low = allSupplies.filter(
      (supply) =>
        Number(supply.currentStock || 0) <= Number(supply.reorderLevel || 0)
    ).length;

    return {
      total,
      low,
      adequate: Math.max(total - low, 0),
    };
  }, [allSupplies]);

  const getStockPercentage = (supply) => {
    const current = Number(supply.currentStock || 0);
    const max = Number(supply.maximumQuantity || 0);

    if (!max) {
      return 0;
    }

    return Math.min(Math.round((current / max) * 100), 100);
  };

  const isLowStock = (supply) =>
    Number(supply.currentStock || 0) <= Number(supply.reorderLevel || 0);

  const formatMeasurement = (value, unit) => {
    if (value === undefined || value === null || value === "") {
      return `0 ${unit || ""}`.trim();
    }
    return `${value} ${unit || ""}`.trim();
  };

  //Layout
  return (
    <Layout>
        {message && <div className="message">{message}</div>}

        <section className="supply-dashboard">
            <div className="supply-header">
                <div>
                    <h1>Supplies Management</h1>
                    <p className="supply-header__subtitle">
                        Track consumable supplies and inventory levels
                    </p>
                </div>
                <button
                  className="supply-add-btn"
                  onClick={() => navigate("/add-supply")}
                >
                  <span className="supply-add-btn__icon">+</span>
                  Add Supply
                </button>
            </div>

            <div className="supply-stats-grid">
                <div className="supply-stat-card">
                    <p>Total Supplies</p>
                    <span>{supplyStats.total}</span>
                </div>
                <div className="supply-stat-card">
                    <p>Low Stock</p>
                    <span className="low">{supplyStats.low}</span>
                </div>
                <div className="supply-stat-card">
                    <p>Adequate Stock</p>
                    <span className="adequate">{supplyStats.adequate}</span>
                </div>
            </div>

            <div className="supply-panel">
                <div className="supply-panel__header">
                    <h2>All Supplies</h2>
                </div>

                {paginatedSupplies.length ? (
                    <div className="supply-card-list">
                        {paginatedSupplies.map((supply) => {
                            const percent = getStockPercentage(supply);
                            const lowStock = isLowStock(supply);
                            const statusClass = lowStock ? "low" : "adequate";

                            return (
                              <article key={supply.supplyId} className="supply-card">
                                  <div className="supply-card__top">
                                      <div>
                                          <h3>{supply.name}</h3>
                                          <p className="supply-card__measurements">
                                              Current: <strong>{formatMeasurement(supply.currentStock, supply.unitOfMeasurement)}</strong> / Max: {formatMeasurement(supply.maximumQuantity, supply.unitOfMeasurement)}
                                          </p>
                                      </div>
                                      <div className="supply-card__actions">
                                          <span className={`supply-card__percentage ${statusClass}`}>{percent}%</span>
                                          <div className="supply-card__icon-buttons">
                                              <button
                                                className="icon-btn delete"
                                                onClick={() => handleDeleteSupply(supply.supplyId)}
                                                aria-label={`Delete ${supply.name}`}
                                              >
                                                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                                      <path d="M6 7h12l-.7 12.1c-.1 1.1-1 1.9-2.1 1.9H8.8c-1.1 0-2-.8-2.1-1.9L6 7zm3.5-4H14c.6 0 1.1.4 1.2 1l.3 1H20v2H4V5h4.6l.3-1c.1-.6.6-1 1.1-1z" />
                                                  </svg>
                                              </button>
                                              <button
                                                className="icon-btn edit"
                                                onClick={() => navigate(`/edit-supply/${supply.supplyId}`)}
                                                aria-label={`Edit ${supply.name}`}
                                              >
                                                  <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                                                      <path d="M15.1 4.3 19.7 9l-9.9 9.9-4.7.6.6-4.7L15.1 4.3zm2.1-2.1c-.5-.5-1.3-.5-1.8 0L13 4.6 18.6 10l2.4-2.4c.5-.5.5-1.3 0-1.8L17.2 2.2z" />
                                                  </svg>
                                              </button>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="supply-level-bar">
                                      <div
                                        className={`supply-level-fill ${statusClass}`}
                                        style={{ width: `${percent}%` }}
                                      />
                                  </div>

                                  <div className="supply-card__footer">
                                      <div>
                                          <p className="label">Restock Level</p>
                                          <p className="value">{formatMeasurement(supply.reorderLevel, supply.unitOfMeasurement)}</p>
                                      </div>
                                      <div>
                                          <p className="label">Unit Type</p>
                                          <p className="value">{supply.unitOfMeasurement || "N/A"}</p>
                                      </div>
                                  </div>
                              </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="supply-empty-state">
                        <p>No supplies found. Add your first supply to get started.</p>
                    </div>
                )}
            </div>
        </section>

        <PaginationComponent
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      />
    </Layout>
  );
};
export default SupplyPage;