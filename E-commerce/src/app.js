const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");
const paymentRoute = require("./routes/paymentRoute");
const reviewRoute = require("./routes/reviewRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const categoryRoute = require("./routes/categoryRoute");

// Some middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// User Route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/category", categoryRoute);

app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/inventory", inventoryRoute);

module.exports = app;
