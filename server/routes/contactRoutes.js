const express =
    require("express");

const router =
    express.Router();

const {
    contact,
} =
    require(
        "../controllers/contactController"
    );

const {
    contactLimiter,
} =
    require(
        "../middleware/rateLimiters"
    );


router.post(
    "/",
    contactLimiter,
    contact
);


module.exports =
    router;
