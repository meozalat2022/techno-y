const supplierService = require("../services/supplier");
const asyncHandler = require("../middleware/asyncHandler");

const createSupplier = asyncHandler(async (req, res) => {

    const supplier = await supplierService.createSupplier(req.body);

    res.status(201).json({
        success: true,
        message: "Supplier created successfully.",
        data: supplier,
    });

});

const listSuppliers = asyncHandler(async (req, res) => {

    const result = await supplierService.listSuppliers({

        page: Number(req.query.page) || 1,

        limit: Number(req.query.limit) || 20,

        search: req.query.search || "",

    });

    res.status(200).json({

        success: true,

        data: result.suppliers,

        pagination: result.pagination,

    });

});

const getSupplier = asyncHandler(async (req, res) => {

    const supplier =
        await supplierService.getSupplier(req.params.id);

    res.status(200).json({
        success: true,
        data: supplier,
    });

});

const updateSupplier = asyncHandler(async (req, res) => {

    const supplier =
        await supplierService.updateSupplier(
            req.params.id,
            req.body
        );

    res.status(200).json({

        success: true,

        message: "Supplier updated successfully.",

        data: supplier,

    });

});

const deleteSupplier = asyncHandler(async (req, res) => {

    await supplierService.deleteSupplier(req.params.id);

    res.status(200).json({

        success: true,

        message: "Supplier deleted successfully.",

    });

});
module.exports = {
    createSupplier,
    listSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier,
};