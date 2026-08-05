const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseRoutes =
    require("./routes/purchaseRoutes");

const brandRoutes =
  require("./routes/brandRoutes");
const uploadRoutes =
  require("./routes/uploadRoutes");

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(helmet());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Techno-Y API Running...");
});
app.use(
    "/api/purchases",
    purchaseRoutes
);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use(
  "/api/categories",
  categoryRoutes
);
app.use(
  "/api/brands",
  brandRoutes
);
app.use("/api/inventory", inventoryRoutes);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/orders", orderRoutes);
const PORT = process.env.PORT || 5000;

const errorHandler =
  require("./middleware/errorMiddleware");


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});