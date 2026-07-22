const express = require("express");

const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
} = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");
const productValidation =
require("../validations/productValidation");


const validate =
require("../middleware/validateMiddleware");

router.get("/", getProducts);

router.get("/:slug", getProductBySlug);

// router.post(
//   "/",
//   protect,
//   admin,
//   createProduct
// );

router.post(
"/",
protect,
admin,
productValidation,
validate,
createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

module.exports = router;