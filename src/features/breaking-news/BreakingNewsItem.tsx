import { useEffect, useRef, useState } from "preact/hooks";

export const BreakingNewsItem = () => {
    const refreshTimeInSeconds = 60;
    const [headline, setHeadline] = useState<string>("Lade News");
    const spanRef = useRef<HTMLSpanElement>(null);
    const isVisible = () => {
        if (spanRef === null) {
            return false;
        }
        const rect = spanRef.current?.getBoundingClientRect();
        if (rect === undefined) {
            return false;
        }

        if (spanRef.current === null) {
            return false;
        }

        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewWidth = window.innerWidth || document.documentElement.clientWidth;

        return rect.top - rect.height >= 0 && rect.left + rect.width >= 0 && rect.bottom + rect.height <= viewHeight && rect.right - rect.width <= viewWidth;
    };
    const getHeadlines = async (): Promise<string[]> => {
        const response = await fetch("./api/breaking-news/news-index.json");

        if (!response.ok) {
            return [];
        }

        return await response.json();
    };
    const getRandomHeadline = async (): Promise<string> => {
        const headlines = await getHeadlines();

        if (headlines.length === 0) {
            return "";
        }

        const index = Math.floor(Math.random() * headlines.length);
        return headlines[index] ?? "";
    };

    useEffect(() => {
        getRandomHeadline().then((data) => {
            setHeadline(data);
        });
        const interval = setInterval(() => {
            if (!isVisible()) {
                getRandomHeadline().then((data) => {
                    setHeadline(data);
                });
            }
        }, 1000 * refreshTimeInSeconds);

        return () => clearInterval(interval);
    }, []);
    return (
        <span class={"ticker-item-span"} ref={spanRef}>
            {headline}
        </span>
    );
};
