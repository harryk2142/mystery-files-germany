import { useBreakingNewsApi } from "@features/breaking-news/useBreakingNewsApi.ts";
import { useEffect, useRef, useState } from "preact/hooks";

export const BreakingNewsItem = ({ max }: { max: number }) => {
    const refreshTimeInSeconds = 120;
    const [headline, setHeadline] = useState<string>("Lade News");
    const spanRef = useRef<HTMLSpanElement>(null);
    const { getHeadline } = useBreakingNewsApi();

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

    const getRandomHeadline = async (): Promise<string> => {
        if (max === 0) {
            return "";
        }
        const index = Math.floor(Math.random() * max);
        const response = await getHeadline(index);
        return response.headline;
    };

    // const getRandomHeadline = async (): Promise<string> => {
    //     const x = await getRandomHeadlineB();
    //     console.log(x);
    //     if (headlines.length === 0) {
    //         return "";
    //     }
    //     const index = Math.floor(Math.random() * headlines.length);
    //     return headlines[index];
    // };

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
