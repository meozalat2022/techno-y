const validateRequest = (body) => {

    const {
        customer,
        items,
        shippingAddress,
        payment,
    } = body;

    // Customer
    if (!customer)
        throw new Error("Customer information is required.");

    if (!customer.firstName)
        throw new Error("Customer first name is required.");

    if (!customer.lastName)
        throw new Error("Customer last name is required.");

    if (!customer.email)
        throw new Error("Customer email is required.");

    if (!customer.phone)
        throw new Error("Customer phone is required.");

    // Items
    if (!items || !Array.isArray(items))
        throw new Error("Order items are required.");

    if (items.length === 0)
        throw new Error("Order must contain at least one item.");

    for (const item of items) {

        if (!item.product)
            throw new Error("Product ID is required.");

        if (!item.quantity)
            throw new Error("Quantity is required.");

        if (item.quantity <= 0)
            throw new Error("Quantity must be greater than zero.");
    }

    // Shipping
    if (!shippingAddress)
        throw new Error("Shipping address is required.");

    if (!shippingAddress.governorate)
        throw new Error("Governorate is required.");

    if (!shippingAddress.city)
        throw new Error("City is required.");

    if (!shippingAddress.address)
        throw new Error("Address is required.");

    // Payment
    if (!payment)
        throw new Error("Payment information is required.");

    if (!payment.method)
        throw new Error("Payment method is required.");

};

module.exports = validateRequest;