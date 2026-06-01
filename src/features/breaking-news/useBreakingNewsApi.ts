export const useBreakingNewsApi = () => {
    const getHeadlines = async (): Promise<string[]> => {
        const response = await fetch("./api/breaking-news/news-index.json");

        if (!response.ok) {
            return [];
        }

        return await response.json();
    };
    const getHeadline = async (
        index: number,
    ): Promise<{
        headline: string;
    }> => {
        const response = await fetch("./api/breaking-news/" + index.toString() + ".json");
        if (!response.ok) {
            return {
                headline: "",
            };
        }

        return await response.json();
    };
    const getInfo = async (): Promise<{
        total: number;
    }> => {
        const response = await fetch("./api/breaking-news/info.json");

        if (!response.ok) {
            return {
                total: 0,
            };
        }

        return await response.json();
    };
    const getRandomHeadline = async (): Promise<string> => {
        const headlines = await getHeadlines();

        const index = Math.floor(Math.random() * headlines.length);
        return headlines[index];
    };
    return {
        getHeadline,
        getHeadlines,
        getInfo,
        getRandomHeadline,
    };
};
