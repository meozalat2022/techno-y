const mongoose = require("mongoose");
const STOCK_STATUS = require("../constants/stockStatus");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    stockStatus: {
      type: String,
      enum: Object.values(STOCK_STATUS),
      default: STOCK_STATUS.IN_STOCK,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    compatibleModels: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    weight: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isBundle: {
      type: Boolean,
      default: false,
    },

    bundleItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },

    /*
     * Physical stock remains in stockQuantity.
     * This buffer is reserved from online sales only.
     * Example:
     * stockQuantity = 5
     * onlineSafetyStock = 1
     * onlineAvailableQuantity = 4
     */
    onlineSafetyStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    trackInventory: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);


/*
 * Do not mutate stockQuantity to implement the online buffer.
 * This virtual is the quantity the storefront is allowed to sell.
 */
productSchema.virtual(
  "onlineAvailableQuantity"
).get(function () {

  if (
    this.trackInventory ===
    false
  ) {
    return null;
  }

  return Math.max(
    Number(this.stockQuantity) -
      Number(this.onlineSafetyStock || 0),
    0
  );

});


module.exports = mongoose.model("Product", productSchema);