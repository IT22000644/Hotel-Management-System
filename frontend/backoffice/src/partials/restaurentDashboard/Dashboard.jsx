import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import SearchBar from "../../components/SearchBar";

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("Today");
  const [orders, setOrders] = useState([]); // Fetch your orders data and set it here
  const [customers, setCustomers] = useState([]); // Fetch your customers data and set it here

  const timePeriods = [
    { value: "Today", label: "Today" },
    { value: "Yesterday", label: "Yesterday" },
    { value: "Last week", label: "Last week" },
    { value: "Last month", label: "Last month" },
  ];

  const [counts, setCounts] = useState({
    allOrders: 0,
    fulfilledOrders: 0,
    pendingOrders: 0,
    customers: 0,
    income: 0,
  });

  useEffect(() => {
    const startDate = new Date();
    switch (timePeriod) {
      case "Today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "Yesterday":
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "Last week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Last month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        break;
    }

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const filteredOrders = orders.filter(
      (order) =>
        new Date(order.date) >= startDate && new Date(order.date) <= endDate
    );
    const filteredCustomers = customers.filter(
      (customer) =>
        new Date(customer.date) >= startDate &&
        new Date(customer.date) <= endDate
    );

    setCounts({
      allOrders: filteredOrders.length,
      fulfilledOrders: filteredOrders.filter(
        (order) => order.status === "fulfilled"
      ).length,
      pendingOrders: filteredOrders.filter(
        (order) => order.status === "pending"
      ).length,
      customers: filteredCustomers.length,
      income: filteredOrders.reduce(
        (total, order) => total + order.billAmount,
        0
      ),
    });
  }, [timePeriod, orders, customers]);

  const cards = [
    { heading: "All Orders", content: counts.allOrders },
    { heading: "Fulfilled Orders", content: counts.fulfilledOrders },
    { heading: "Pending Orders", content: counts.pendingOrders },
    { heading: "Customers", content: counts.customers },
    { heading: "Income", content: counts.income },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
      <SearchBar alignment="left" />
      <hr className="border-t border-second_background mt-4 mb-10" />

      <select
        value={timePeriod}
        onChange={(e) => setTimePeriod(e.target.value)}
        className="w-1/3 mb-10 rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
      >
        {timePeriods.map((period, index) => (
          <option key={index} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>

      <div className="mb-20 flex justify-between">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-1/5 m-4 bg-button_color p-6 rounded-lg shadow-lg text-center"
          >
            <h2 className="text-xl font-bold text-white">{card.heading}</h2>
            <p className="text-2xl font-bold text-black">{card.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
