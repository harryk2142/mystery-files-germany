import { BreakingNewsItem } from "@features/breaking-news/BreakingNewsItem.tsx";
import { useBreakingNewsApi } from "@features/breaking-news/useBreakingNewsApi.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import "./BreakingNewsItems.css";
import { Fragment } from "preact/jsx-runtime";

export const BreakingNewsItems = () => {
    const ITEMS = 10;
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    const [max, setMax] = useState<{
        total: number;
    }>({
        total: 0,
    });
    const { getInfo } = useBreakingNewsApi();

    useEffect(() => {
        const loadHeadlines = async () => {
            setMax(await getInfo());
        };
        loadHeadlines();
    }, []);

    return max.total > 0 ? (
        <div id={"ticker-container"} ref={containerRef}>
            <div class={"ticker-items"} ref={marqueeRef}>
                {Array.from({
                    length: ITEMS,
                }).map((_, i) => (
                    <Fragment key={i}>
                        {(i > 0 || i === ITEMS) && <span> +++ </span>}
                        <BreakingNewsItem key={i} max={max.total} />
                    </Fragment>
                ))}
            </div>
        </div>
    ) : (
        <div id={"ticker-container"} ref={marqueeRef}>
            <div class={"ticker-items"}>
                <span class={"ticker-item-span"}>Lade Breaking News</span>
            </div>
        </div>
    );
};
