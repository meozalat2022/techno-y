const express = require("express");

const router = express.Router();


const {
createCategory,
getCategories,
getCategoryBySlug,
updateCategory,
deleteCategory

}=require("../controllers/categoryController");


const {
protect
}=require("../middleware/authMiddleware");


const admin =
require("../middleware/adminMiddleware");


// Public

router.get(
"/",
getCategories
);


router.get(
"/:slug",
getCategoryBySlug
);



// Admin

router.post(
"/",
protect,
admin,
createCategory
);


router.put(
"/:id",
protect,
admin,
updateCategory
);


router.delete(
"/:id",
protect,
admin,
deleteCategory
);



module.exports = router;