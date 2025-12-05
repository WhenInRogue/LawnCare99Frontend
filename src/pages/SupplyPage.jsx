import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const itemsPerPage = 6;

const SupplyPage = () => {
  const [allSupplies, setAllSupplies] = useState([]);
  const [visibleSupplies, setVisibleSupplies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getSupplies = async () => {
      try {
        const supplyData = await ApiService.getAllSupplies();
        if (supplyData.status === 200) {
          setAllSupplies(supplyData.supplies);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Supplies: " + error
        );
      }
    };
    getSupplies();
  }, []);

  useEffect(() => {
    const nextTotalPages = Math.max(
      1,
      Math.ceil(allSupplies.length / itemsPerPage) || 1
    );
    setTotalPages(nextTotalPages);

    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    setVisibleSupplies(
      allSupplies.slice(startIndex, startIndex + itemsPerPage)
    );
  }, [allSupplies, currentPage]);

  const handleDeleteSupply = async (supplyId) => {
    if (window.confirm("Are you sure you want to delete this supply?")) {
      try {
        await ApiService.deleteSupply(supplyId);
        setAllSupplies((prev) => prev.filter((s) => s.supplyId !== supplyId));
        showMessage("Supply successfully deleted");
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error deleting supply: " + error
        );
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const totalSupplies = allSupplies.length;
  const lowStockItems = allSupplies.filter(
    (supply) => supply.currentStock <= supply.reorderLevel
  );
  const lowStockCount = lowStockItems.length;
  const adequateStock = Math.max(totalSupplies - lowStockCount, 0);

  const getStockMeta = (supply) => {
    if (!supply.maximumQuantity) {
      return { percent: 0, tone: "warning", label: "No max set" };
    }
    const percent = Math.min(
      100,
      Math.round((supply.currentStock / supply.maximumQuantity) * 100)
    );
    if (supply.currentStock <= supply.reorderLevel) {
      return { percent, tone: "danger", label: "Critical" };
    }
    if (percent < 35) {
      return { percent, tone: "warning", label: "Low" };
    }
    return { percent, tone: "success", label: "Healthy" };
  };

  return (
    <Layout>
      {message && <div className="message in-page">{message}</div>}
      <div className="page-shell">
        <header className="page-header supply-header">
          <div>
            <p className="eyebrow-text">Supplies Management</p>
            <h1>Track consumable supplies and inventory levels</h1>
            <p className="subtitle-text">
              Monitor what is in stock, identify low inventory, and keep the crew
              prepared for the next job.
            </p>
          </div>
          <button
            className="action-btn dark"
            onClick={() => navigate("/add-supply")}
          >
            + Add Supply
          </button>
        </header>

        {lowStockCount > 0 && (
          <div className="alert-card danger">
            <strong>{lowStockCount} item(s)</strong> are below restock level and
            need restocking
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-card">
            <p>Total Supplies</p>
            <span>{totalSupplies}</span>
          </div>
          <div className="stat-card">
            <p>Low Stock</p>
            <span className="text-danger">{lowStockCount}</span>
          </div>
          <div className="stat-card">
            <p>Adequate Stock</p>
            <span className="text-success">{adequateStock}</span>
          </div>
        </div>

        <section className="inventory-section">
          <div className="section-header">
            <div>
              <p className="eyebrow-text">All Supplies</p>
              <p className="subtitle-text">
                {totalSupplies} item{totalSupplies === 1 ? "" : "s"} in inventory
              </p>
            </div>
          </div>

          {visibleSupplies.length === 0 ? (
            <p className="empty-state">No supplies available.</p>
          ) : (
            <div className="supply-list">
              {visibleSupplies.map((supply) => {
                const stockMeta = getStockMeta(supply);
                return (
                  <article key={supply.supplyId} className="supply-card">
                    <div className="supply-card-header">
                      <div>
                        <h3>{supply.name}</h3>
                        <p className="supply-meta">
                          Current: {supply.currentStock} {supply.unitOfMeasurement} / Max:{" "}
                          {supply.maximumQuantity} {supply.unitOfMeasurement}
                        </p>
                      </div>
                      <span className={`status-badge ${stockMeta.tone}`}>
                        {stockMeta.label}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-fill ${stockMeta.tone}`}
                        style={{ width: `${stockMeta.percent}%` }}
                      />
                      <span className="progress-value">{stockMeta.percent}%</span>
                    </div>

                    <div className="supply-stats">
                      <span>Restock Level: {supply.reorderLevel} {supply.unitOfMeasurement}</span>
                      <span>Unit Type: {supply.unitOfMeasurement}</span>
                    </div>

                    <div className="supply-actions">
                      <button
                        className="ghost-btn"
                        onClick={() => navigate(`/edit-supply/${supply.supplyId}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="ghost-btn danger"
                        onClick={() => handleDeleteSupply(supply.supplyId)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
};

export default SupplyPage;
