export function formatDate(date: Date): string {
    return date.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
