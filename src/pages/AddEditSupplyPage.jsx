import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplyPage = () => {
    const { supplyId} = useParams("");
    const [name, setName] = useState("");
    const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
    const [currentStock, setCurrentStock] = useState("");
    const [reorderLevel, setReorderLevel] = useState("");
    const [maximumQuantity, setMaximumQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupplyById = async () => {
            if (supplyId) {
                setIsEditing(true);
                try {
                  const supplyData = await ApiService.getSupplyById(supplyId);
                  if (supplyData.status === 200) {
                    setName(supplyData.supply.name);
                    setUnitOfMeasurement(supplyData.supply.unitOfMeasurement);
                    setCurrentStock(supplyData.supply.currentStock);
                    setReorderLevel(supplyData.supply.reorderLevel);
                    setMaximumQuantity(supplyData.supply.maximumQuantity);
                    setDescription(supplyData.supply.description);
                  } else {
                    showMessage(supplyData.message);
                  }
                } catch (error) {
                  showMessage(
                    error.response?.data?.message ||
                      "Error fetching supply by Id: " + error
                  );
                }

            }
        };

        if (supplyId) fetchSupplyById();
    }, [supplyId]);

    //method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supplyData = {
        name,
        unitOfMeasurement,
        currentStock,
        reorderLevel,
        maximumQuantity,
        description,
    };

    try {
        if (isEditing) {
            await ApiService.updateSupply(supplyId, supplyData);
            showMessage("Supply successfully updated");
        } else {
            await ApiService.createSupply(supplyData);
            showMessage("Supply successfully created 🤩");
        }
        navigate("/supply");
    } catch (error) {
        showMessage(
        error.response?.data?.message ||
            "Error saving the supply: " + error
        );
    }
  };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="product-form-page">
                <h1>{isEditing ? "Edit Supply" : "Add Supply"}</h1>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Supply Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Unit of Measurement</label>
                        <input
                            type="text"
                            value={unitOfMeasurement}
                            onChange={(e) => setUnitOfMeasurement(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Current Stock</label>
                        <input
                            type="number"
                            value={currentStock}
                            onChange={(e) => setCurrentStock(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Reorder Level</label>
                        <input
                            type="number"
                            value={reorderLevel}
                            onChange={(e) => setReorderLevel(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Maximum Quantity</label>
                        <input
                            type="number"
                            value={maximumQuantity}
                            onChange={(e) => setMaximumQuantity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit">{isEditing ? "Edit Supply" : "Add Supply"}</button>
                    
                </form>
            </div>
        </Layout>
    );

};

export default AddEditSupplyPage;