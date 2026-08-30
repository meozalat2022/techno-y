export default function getOnlineAvailableQuantity(
    product
) {

    if (!product) {
        return 0;
    }


    if (
        product.onlineAvailableQuantity !==
        undefined &&
        product.onlineAvailableQuantity !==
        null
    ) {

        return Math.max(
            Number(
                product.onlineAvailableQuantity
            ) || 0,
            0
        );

    }


    const physicalStock =
        Number(
            product.stockQuantity
        ) || 0;


    const safetyStock =
        Number(
            product.onlineSafetyStock
        ) || 0;


    return Math.max(
        physicalStock -
            safetyStock,
        0
    );

}
