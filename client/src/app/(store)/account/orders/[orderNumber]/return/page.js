import ReturnRequestClient from
    "@/components/store/account/ReturnRequestClient";


export default async function ReturnRequestPage({
    params,
}) {

    const {
        orderNumber,
    } =
        await params;


    return (
        <ReturnRequestClient
            orderNumber={
                orderNumber
            }
        />
    );

}