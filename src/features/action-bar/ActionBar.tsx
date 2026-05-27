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
    }, [$currentCommentCount]);
    const onClickLike = async (ev: PointerEvent) => {
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
    const onClickComment = async (ev: PointerEvent) => {
        const element = document.querySelector("#comments-section");
        element?.scrollIntoView();
    };
    const onClickShare = async (ev: PointerEvent) => {
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
                            <img alt="like count" src={heart.src} />
                        </button>
                        <div className={"action-text"}>{likeCount}</div>
                    </div>
                    <div className="action-item">
                        <button onClick={onClickComment} type={"button"}>
                            <img alt="like count" src={message.src} />
                        </button>
                        <div className={"action-text"}>{commentCount}</div>
                    </div>
                    <div className="action-item">
                        <button onClick={onClickShare} type={"button"}>
                            <img alt="like count" src={share.src} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
