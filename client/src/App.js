// src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const products = [
  { id: 1, name: "Item 1", price: 100, weight: 200 },
  { id: 2, name: "Item 2", price: 60, weight: 300 },
  { id: 3, name: "Item 3", price: 120, weight: 150 },
  { id: 4, name: "Item 4", price: 90, weight: 250 },
  { id: 5, name: "Item 5", price: 50, weight: 100 },
  { id: 6, name: "Item 6", price: 100, weight: 400 },
  { id: 7, name: "Item 7", price: 80, weight: 200 },
];

function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [packages, setPackages] = useState(null);

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/place-order", { items: selectedItems })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error("There was an error placing the order!", error);
      });
  };

  return (
    <div className="App">
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <label>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(product)}
                checked={selectedItems.includes(product)}
              />
              {product.name} - ${product.price} - {product.weight}g
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Place Order</button>

      {packages && (
        <div>
          <h2>This order has following packages:</h2>
          {packages.map((pkg, index) => (
            <div key={index}>
              <h3>Package {index + 1}</h3>
              <p>Items: {pkg.items.map((item) => item.name).join(", ")}</p>
              <p>Total weight: {pkg.totalWeight}g</p>
              <p>Total price: ${pkg.totalPrice}</p>
              <p>Courier price: ${pkg.courierPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
