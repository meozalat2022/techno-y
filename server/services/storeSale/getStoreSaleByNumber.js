const StoreSale =
    require("../../models/StoreSale");


const getStoreSaleByNumber =
    async saleNumber => {

        const storeSale =
            await StoreSale.findOne({
                saleNumber,
            })
                .populate(
                    "performedBy",
                    "firstName lastName email"
                )
                .populate(
                    "items.product",
                    "title sku stockQuantity onlineSafetyStock"
                );


        if (!storeSale) {

            const error =
                new Error(
                    "Store sale not found."
                );

            error.statusCode =
                404;

            throw error;

        }


        return storeSale;

    };


module.exports =
    getStoreSaleByNumber;
