import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import CheckInTabs from "../component/CheckInTabs";

const CheckOutSupplyPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [supplyId, setSupplyId] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const supplyData = await ApiService.getAllSupplies();
        setSupplies(supplyData.supplies);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching supplies: " + error
        );
      }
    };

    fetchSupplies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplyId || !quantity) {
      showMessage("Please fill in all required fields");
      return;
    }
    const body = {
      supplyId,
      quantity: parseInt(quantity, 10),
      note,
    };

    try {
      const response = await ApiService.checkOutSupply(body);
      showMessage(response.message);
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error checking out supply: " + error
      );
    }
  };

  const resetForm = () => {
    setSupplyId("");
    setNote("");
    setQuantity("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <div className="checkio-page">
        <CheckInTabs />
        {message && <div className="message in-page">{message}</div>}

        <section className="form-card">
          <header className="form-card-header">
            <div>
              <p className="eyebrow-text">Supplies</p>
              <h2>Check-Out Supply</h2>
              <p className="subtitle-text">
                Assign consumables to crews and track how much is leaving the
                inventory.
              </p>
            </div>
          </header>

          <form className="stacked-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select supply</label>
              <select
                value={supplyId}
                onChange={(e) => setSupplyId(e.target.value)}
                required
              >
                <option value="">Select a supply</option>
                {supplies.map((supply) => (
                  <option key={supply.supplyId} value={supply.supplyId}>
                    {supply.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Note</label>
              <input
                type="text"
                placeholder="Optional notes..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              Check-Out Supply
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default CheckOutSupplyPage;
