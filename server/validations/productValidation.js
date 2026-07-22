const { body } = require("express-validator");


const productValidation = [

  body("title")
    .notEmpty()
    .withMessage("Product title is required"),


  // body("slug")
  //   .notEmpty()
  //   .withMessage("Product slug is required"),


  body("sku")
    .notEmpty()
    .withMessage("Product SKU is required"),


  body("category")
    .notEmpty()
    .withMessage("Category is required"),


  body("brand")
    .notEmpty()
    .withMessage("Brand is required"),


  body("regularPrice")
    .isNumeric()
    .withMessage("Price must be a number"),


];


module.exports = productValidation;