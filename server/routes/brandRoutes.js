const express = require("express");

const router = express.Router();


const {
  createBrand,
  getBrands,
  getBrandBySlug,
  updateBrand,
  deleteBrand,

} = require("../controllers/brandController");


const {
  protect,

} = require("../middleware/authMiddleware");


const admin =
require("../middleware/adminMiddleware");


// Public

router.get(
  "/",
  getBrands
);


router.get(
  "/:slug",
  getBrandBySlug
);



// Admin

router.post(
  "/",
  protect,
  admin,
  createBrand
);


router.put(
  "/:id",
  protect,
  admin,
  updateBrand
);


router.delete(
  "/:id",
  protect,
  admin,
  deleteBrand
);



module.exports = router;