const MESSAGES =
    require("../constants/messages");

const asyncHandler =
    require("../middleware/asyncHandler");

const supplierService =
    require("../services/supplier");

const {
    successResponse,
} =
    require("../utils/apiResponse");


const createSupplier =
    asyncHandler(async (req, res) => {

        const supplier =
            await supplierService
                .createSupplier(
                    req.body
                );


        return successResponse(

            res,

            supplier,

            MESSAGES.SUPPLIER.CREATED,

            201

        );

    });


const listSuppliers =
    asyncHandler(async (req, res) => {

        const result =
            await supplierService
                .listSuppliers({

                    page:
                        req.query.page,

                    limit:
                        req.query.limit,

                    search:
                        req.query.search || "",

                });


        return successResponse(

            res,

            result.suppliers,

            MESSAGES.SUPPLIER
                .LIST_RETRIEVED,

            200,

            result.pagination

        );

    });


const getSupplier =
    asyncHandler(async (req, res) => {

        const supplier =
            await supplierService
                .getSupplier(
                    req.params.id
                );


        return successResponse(

            res,

            supplier,

            MESSAGES.SUPPLIER.RETRIEVED

        );

    });


const updateSupplier =
    asyncHandler(async (req, res) => {

        const supplier =
            await supplierService
                .updateSupplier({

                    supplierId:
                        req.params.id,

                    supplierData:
                        req.body,

                });


        return successResponse(

            res,

            supplier,

            MESSAGES.SUPPLIER.UPDATED

        );

    });


const deleteSupplier =
    asyncHandler(async (req, res) => {

        await supplierService
            .deleteSupplier(
                req.params.id
            );


        return successResponse(

            res,

            null,

            MESSAGES.SUPPLIER.DELETED

        );

    });


module.exports = {

    createSupplier,

    listSuppliers,

    getSupplier,

    updateSupplier,

    deleteSupplier,

};