// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to process the order
app.post("/api/place-order", (req, res) => {
  const { items } = req.body;
  const packages = processOrder(items);
  res.json(packages);
});

const processOrder = (items) => {
  const maxCost = 250;
  const courierCost = 15;

  // Sorting items by weight to achieve more even distribution
  items.sort((a, b) => a.weight - b.weight);

  let packages = [];
  let currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };

  items.forEach((item) => {
    if (currentPackage.totalPrice + item.price <= maxCost) {
      currentPackage.items.push(item);
      currentPackage.totalWeight += item.weight;
      currentPackage.totalPrice += item.price;
    } else {
      packages.push({ ...currentPackage, courierPrice: courierCost });
      currentPackage = {
        items: [item],
        totalWeight: item.weight,
        totalPrice: item.price,
      };
    }
  });

  if (currentPackage.items.length > 0) {
    packages.push({ ...currentPackage, courierPrice: courierCost });
  }

  return packages;
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
