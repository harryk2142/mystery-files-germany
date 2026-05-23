// src/utils/readingTime.ts
export function getReadingTime(text: string, wordsPerMinute = 200): string {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} Min. Lesezeit`;
}
