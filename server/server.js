const express =
    require("express");

const dotenv =
    require("dotenv");

const cors =
    require("cors");

const cookieParser =
    require("cookie-parser");

const morgan =
    require("morgan");

const helmet =
    require("helmet");

const connectDB =
    require("./config/db");

const validateEnv =
    require(
        "./config/validateEnv"
    );

const startOpayPendingExpiryJob =
    require(
        "./jobs/opayPendingExpiryJob"
    );


dotenv.config();

validateEnv();

connectDB();


const app =
    express();


/*
 * Railway / common production hosts sit behind
 * a reverse proxy. Trusting one proxy hop lets
 * req.ip reflect the real client address for
 * rate limiting instead of the proxy address.
 */
if (
    process.env.NODE_ENV ===
    "production"
) {

    app.set(
        "trust proxy",
        1
    );

}


app.use(
    express.json({
        limit: "1mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb",
    })
);

app.use(
    cookieParser()
);


const authRoutes =
    require(
        "./routes/authRoutes"
    );

const productRoutes =
    require(
        "./routes/productRoutes"
    );

const categoryRoutes =
    require(
        "./routes/categoryRoutes"
    );

const orderRoutes =
    require(
        "./routes/orderRoutes"
    );

const inventoryRoutes =
    require(
        "./routes/inventoryRoutes"
    );

const supplierRoutes =
    require(
        "./routes/supplierRoutes"
    );

const purchaseRoutes =
    require(
        "./routes/purchaseRoutes"
    );

const brandRoutes =
    require(
        "./routes/brandRoutes"
    );

const uploadRoutes =
    require(
        "./routes/uploadRoutes"
    );

const customerReturnRoutes =
    require(
        "./routes/customerReturnRoutes"
    );

const supplierReturnRoutes =
    require(
        "./routes/supplierReturnRoutes"
    );

const contactRoutes =
    require(
        "./routes/contactRoutes"
    );

const paymentRoutes =
    require(
        "./routes/paymentRoutes"
    );


const storeSaleRoutes =
    require(
        "./routes/storeSaleRoutes"
    );


app.use(
    cors({

        origin:
            process.env.CLIENT_URL,

        credentials:
            true,

    })
);


app.use(
    helmet()
);


app.use(
    process.env.NODE_ENV ===
        "production"
        ? morgan(
            "combined"
        )
        : morgan(
            "dev"
        )
);


app.get(
    "/",
    (
        req,
        res
    ) => {

        res.send(
            "Techno-Y API Running..."
        );

    }
);


app.use(
    "/api/purchases",
    purchaseRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/brands",
    brandRoutes
);

app.use(
    "/api/inventory",
    inventoryRoutes
);

app.use(
    "/api/upload",
    uploadRoutes
);

app.use(
    "/api/suppliers",
    supplierRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/customer-returns",
    customerReturnRoutes
);

app.use(
    "/api/supplier-returns",
    supplierReturnRoutes
);

app.use(
    "/api/contact",
    contactRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);


app.use(
    "/api/store-sales",
    storeSaleRoutes
);


const PORT =
    process.env.PORT ||
    5000;


app.use(
    (
        req,
        res
    ) => {

        res
            .status(404)
            .json({

                success: false,

                message:
                    "Route not found",

            });

    }
);


const errorHandler =
    require(
        "./middleware/errorMiddleware"
    );


app.use(
    errorHandler
);


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

        startOpayPendingExpiryJob();

    }
);
