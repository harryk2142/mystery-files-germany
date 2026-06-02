import { BreakingNewsItem } from "@features/breaking-news/BreakingNewsItem.tsx";
import { useBreakingNewsApi } from "@features/breaking-news/useBreakingNewsApi.ts";
import { useEffect, useState } from "preact/hooks";
import "./BreakingNewsItems.css";
export const BreakingNewsItems = () => {
    const [breakingNews, setBreakingNews] = useState<string[]>([]);
    const [max, setMax] = useState<{
        total: number;
    }>({
        total: 0,
    });
    const { getHeadlines, getInfo } = useBreakingNewsApi();

    useEffect(() => {
        const loadHeadlines = async () => {
            setBreakingNews(await getHeadlines());
            setMax(await getInfo());
        };
        loadHeadlines();
    }, []);

    return breakingNews.length > 0 ? (
        <div class={"ticker-item"}>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
            <span> +++ </span>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
            <span> +++ </span>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
            <span> +++ </span>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
            <span> +++ </span>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
            <span> +++ </span>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
            <span> +++ </span>
            <BreakingNewsItem headlines={breakingNews} max={max.total} />
        </div>
    ) : (
        <div class={"ticket-item"}>
            <span class={"ticker-item-span"}>Lade Breaking News</span>
        </div>
    );
};
