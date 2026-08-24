import OrderDetailsClient from
    "@/components/store/account/OrderDetailsClient";


export default async function MyOrderDetailsPage({
    params,
}) {

    const {
        orderNumber,
    } =
        await params;


    return (
        <OrderDetailsClient
            orderNumber={
                orderNumber
            }
        />
    );

}