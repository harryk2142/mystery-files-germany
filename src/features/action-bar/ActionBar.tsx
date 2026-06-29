import "./ActionBar.css";
import { commentCountStore } from "@features/firebase/firebaseStore";
import { firestoreBlogRepository } from "@features/firebase/firestoreAdapter";
import { useStore } from "@nanostores/preact";
import { useEffect, useState } from "preact/hooks";

import heart from "./../../assets/icons/heart.svg";
import message from "./../../assets/icons/message.svg";
import share from "./../../assets/icons/share.svg";

type Props = {
    title: string;
    headline: string;
    slug: string;
};
export const ActionBar = ({ title, headline, slug }: Props) => {
    const [likeCount, setlikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const $currentCommentCount = useStore(commentCountStore);

    useEffect(() => {
        const loadData = async () => {
            try {
                const loadedLikes = await firestoreBlogRepository.getLikes(slug);
                setlikeCount(loadedLikes);
                const commentCount = await firestoreBlogRepository.getCommentCount(slug);
                setCommentCount(commentCount);
            } catch (e) {
                console.error("Fehler beim Laden", e);
            } finally {
                setLoading(false);
            }
        };
        void loadData();
    }, []);
    useEffect(() => {
        setCommentCount($currentCommentCount);
    }, [
        $currentCommentCount,
    ]);
    const onClickLike = async (ev: MouseEvent) => {
        try {
            (ev.target as HTMLButtonElement).setAttribute("disabled", "true");
            setlikeCount(likeCount + 1);
            await firestoreBlogRepository.incrementLikes(slug);
        } catch (e) {
            console.error("Fehler beim Liken:", e);
        } finally {
            (ev.target as HTMLButtonElement).removeAttribute("disabled");
        }
    };
    const onClickComment = async (ev: MouseEvent) => {
        const element = document.querySelector("#comments-section");
        element?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    };
    const onClickShare = async (ev: MouseEvent) => {
        if (navigator) {
            await navigator
                .share({
                    title: title,
                    text: headline,
                    url: window.location.href,
                })
                .then(() => console.log("Successful share! 🎉"))
                .catch((err) => console.error(err));
        }
    };
    return (
        <div className={"action-bar"}>
            {loading ? (
                <div>Daten werden geladen</div>
            ) : (
                <div className="action-bar-body">
                    <div className="action-item">
                        <button onClick={onClickLike} type={"button"}>
                            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <title>like</title>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                        <div className={"action-text"}>{likeCount}</div>
                    </div>
                    <div className="action-item">
                        <button onClick={onClickComment} type={"button"}>
                            <svg
                                class="icon"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>comment</title>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                        <div className={"action-text"}>{commentCount}</div>
                    </div>
                    <div className="action-item">
                        <button onClick={onClickShare} type={"button"}>
                            <svg
                                class="icon"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>share</title>
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
