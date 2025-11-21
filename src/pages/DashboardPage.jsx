import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const DashboardPage = () => {
    const [message, setMessage] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedData, setSelectedData] = useState("amount");
    //variable to store and set transaction data formated for chart display
    const [supplyTransactionData, setSupplyTransactionData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supplyTransactionResponse = await ApiService.getAllSupplyTransactions();
                if (supplyTransactionResponse.status === 200) {
                    setSupplyTransactionData(
                        transformSupplyTransactionData(
                            supplyTransactionResponse.supplyTransactions,
                            selectedMonth,
                            selectedYear
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
        fetchData();
    }, [selectedMonth, selectedYear, selectedData]);

    const transformSupplyTransactionData = (supplyTransactions, month, year) => {
        const dailyData = {};
        //get number of days in the selected month year
        const daysInMonth = new Date(year, month, 0).getDate();
        //initialize each day in the month with default values
        for (let day = 1; day <= daysInMonth; day++) {
            dailyData[day] = { 
                day, 
                count: 0,
                quantity: 0,
            };
        }

        //process each transaction to accumulate daily counts and quantities
        supplyTransactions.forEach((supplyTransaction) => {
            const supplyTransactionDate = new Date(supplyTransaction.createdAt);
            const supplyTransactionMonth = supplyTransactionDate.getMonth() + 1;
            const supplyTransactionYear = supplyTransactionDate.getFullYear();

            //if transaction falls within selected month and year, accumulate data for the day
            if (supplyTransactionMonth === month && supplyTransactionYear === year) {
                const day = supplyTransactionDate.getDate();
                dailyData[day].count += 1;
                dailyData[day].quantity += supplyTransaction.quantity;
            }
        });
        //convert dailyData object to an array for charting compatibility
        return Object.values(dailyData);
    };

    //event handler for month selection or change
    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    };

    //event handler for year selection or change
    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 4000);
    };

    return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="dashboard-page">
        <div className="button-group">
          <button onClick={() => setSelectedData("count")}>
            Total No Of Transactions
          </button>
          <button onClick={() => setSelectedData("quantity")}>
            Supply Quantity
          </button>

        </div>

        
        <div className="dashboard-content">
          <div className="filter-section">
            <label htmlFor="month-select">Select Month:</label>
            <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <label htmlFor="year-select">Select Year:</label>
            <select id="year-select" value={selectedYear} onChange={handleYearChange}>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Display the chart */}
          <div className="chart-section">
            <div className="chart-container">
                <h3>Daily Transactions</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={supplyTransactionData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="day" label={{value: "Day", position: "insideBottomRight", offset: -5}}/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Line type={"monotone"}
                        dataKey={selectedData}
                        stroke="#008080"
                        fillOpacity={0.3}
                        fill="#008080"
                        />
                    </LineChart>
                </ResponsiveContainer>

            </div>

          </div>


        </div>
      </div>
    </Layout>
  );



};

export default DashboardPage;