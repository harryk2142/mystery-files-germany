export function epochMsToDate(epochMs: number): Date {
    if (!Number.isFinite(epochMs) || epochMs < 0) {
        throw new Error("Invalid epoch timestamp. Must be a non-negative number.");
    }
    return new Date(epochMs);
}
export function formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
export function dateToEpochMs(date: Date): number {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid Date object provided.");
    }
    return Math.floor(date.getTime());
}