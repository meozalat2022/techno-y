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

app.use(
"/api/upload",
uploadRoutes
);
const PORT = process.env.PORT || 5000;

const errorHandler =
require("./middleware/errorMiddleware");


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});