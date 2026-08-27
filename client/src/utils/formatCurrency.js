const formatter =
    new Intl.NumberFormat(
        "ar-EG",
        {
            style: "currency",
            currency: "EGP",
            maximumFractionDigits: 2,
        }
    );

export default function formatCurrency(
    value
) {
    const formatted =
        formatter.format(
            Number(value) || 0
        );

    // Unicode LTR isolate keeps the complete money value together
    // inside Arabic/RTL sentences and flex layouts.
    return `⁦${formatted}⁩`;
}
