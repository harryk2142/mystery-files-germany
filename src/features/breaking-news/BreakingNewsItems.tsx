import { BreakingNewsItem } from "@features/breaking-news/BreakingNewsItem.tsx";
import { useBreakingNewsApi } from "@features/breaking-news/useBreakingNewsApi.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import "./BreakingNewsItems.css";
import { Fragment } from "preact/jsx-runtime";

export const BreakingNewsItems = () => {
    const ITEMS = 7;
    const SPEED = 7;
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
    useEffect(() => {
        const containerEl = containerRef.current;
        const marqueeEl = marqueeRef.current;
        if (!containerEl || !marqueeEl || max.total === 0) return;

        // Evtl. einfach mit Media Queries
        /*
        .marquee {
  animation: marquee 20s linear infinite;
}

@media (max-width: 768px) {
  .marquee {
    animation-duration: 12s;
  }
}

@media (max-width: 480px) {
  .marquee {
    animation-duration: 8s;
  }
}

         */
        const updateSpeed = () => {
            const width = containerEl.scrollWidth / 2;
            marqueeEl.style.animationDuration = `${width / SPEED}s`;
        };

        // ✅ Initial berechnen (bei neuen Messages)
        updateSpeed();

        // ✅ Reagiert auf echte Größenänderungen
        const observer = new ResizeObserver(updateSpeed);
        observer.observe(containerEl);

        return () => observer.disconnect();
    }, [
        max,
    ]);

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
