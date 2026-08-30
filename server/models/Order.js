const mongoose = require("mongoose");
// const Counter = require("./Counter");
// const ORDER_STATUS = require("../constants/orderStatus");
const ORDER_STATUS =
  require("../constants/orderStatus");
  const PAYMENT_METHODS = require("../constants/paymentMethods");
  const PAYMENT_STATUS = require("../constants/paymentStatus");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },


    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    compatibleModels: [
      {
        type: String,
        trim: true,
      },
    ],

    pricing: {
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

      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },



    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    returnedQuantity: {
    type: Number,
    default: 0,
    min: 0,
},
    inventory: {

      stockBefore: {
        type: Number,
        default: 0,
      },

      stockAfter: {
        type: Number,
        default: 0,
      },

    },
  },
  {
    _id: false,
  }
);

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);
const shippingAddressSchema = new mongoose.Schema(
  {
    governorate: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    landmark: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);





//Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.COD,
    },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    provider: {
      type: String,
      default: "",
      trim: true,
    },

    reference: {
      type: String,
      default: "",
      trim: true,
    },

    providerOrderNo: {
      type: String,
      default: "",
      trim: true,
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    cashierUrl: {
      type: String,
      default: "",
      trim: true,
    },

    providerStatus: {
      type: String,
      default: "",
      trim: true,
    },

    failureCode: {
      type: String,
      default: "",
      trim: true,
    },

    failureReason: {
      type: String,
      default: "",
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    inventoryRestored: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

//Shipping Schema

const shippingSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
      trim: true,
    },

    method: {
      type: String,
      default: "Standard",
      trim: true,
    },

    cost: {
      type: Number,
      default: 0,
      min: 0,
    },

    trackingNumber: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

//total Schema


const totalsSchema = new mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// Loyalty Schema

const loyaltySchema =
  new mongoose.Schema(
    {
      pointsRedeemed: {
        type: Number,
        default: 0,
        min: 0,
      },

      redemptionAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      pointsPending: {
        type: Number,
        default: 0,
        min: 0,
      },

      pointsAwarded: {
        type: Number,
        default: 0,
        min: 0,
      },

      pointsReversed: {
        type: Number,
        default: 0,
        min: 0,
      },

      redeemedPointsRestored: {
        type: Number,
        default: 0,
        min: 0,
      },

      pendingCancelled: {
        type: Boolean,
        default: false,
      },

      redemptionRestoredOnCancellation: {
        type: Boolean,
        default: false,
      },

      awardedAt: {
        type: Date,
        default: null,
      },
    },
    {
      _id: false,
    }
  );


// order Schema


const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: customerSchema,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (items) => items.length > 0,
        "Order must contain at least one item.",
      ],
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    payment: {
      type: paymentSchema,
      required: true,
    },

    shipping: {
      type: shippingSchema,
      required: true,
    },

    totals: {
      type: totalsSchema,
      required: true,
    },

    loyalty: {
      type: loyaltySchema,
      default: () => ({}),
    },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),

      default: ORDER_STATUS.PENDING
    },

    notes: {
      customer: {
        type: String,
        default: "",
      },

      admin: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// orderSchema.index({ orderNumber: 1 });

orderSchema.index({ status: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ "customer.email": 1 });

module.exports = mongoose.model("Order", orderSchema);