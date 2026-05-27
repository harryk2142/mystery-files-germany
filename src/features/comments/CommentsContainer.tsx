import "./CommentsContainer.css";
import type { Comment } from "@features/blog-interactions/types";
import { commentCountStore } from "@features/firebase/firebaseStore";
import { firestoreBlogRepository } from "@features/firebase/firestoreAdapter";
import { useStore } from "@nanostores/preact";
import { useEffect, useState } from "preact/hooks";

interface Props {
    slug: string;
}

// === 1. HAUPTKOMPONENTE ===
export const CommentsContainer = ({ slug }: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const $currentCommentCount = useStore(commentCountStore);

    // Initiales Laden
    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await firestoreBlogRepository.getComments(slug);
                setComments(data);
            } catch (e) {
                console.error("Fehler beim Laden:", e);
            } finally {
                setLoading(false);
            }
        };
        void loadComments();
    }, [slug]);

    // Funktion zum Hinzufügen (mit Default-Parameter für parentId)
    const handleAddComment = async (authorName: string, text: string, parentId: string | null = null) => {
        await firestoreBlogRepository.addComment(slug, { authorName, text, parentId });

        // Nach dem Speichern laden wir die frische Liste vom Server
        const updatedData = await firestoreBlogRepository.getComments(slug);
        setComments(updatedData);
        commentCountStore.set($currentCommentCount + 1);
    };

    if (loading) return <p>Kommentare werden geladen...</p>;

    // Filtern der obersten Ebene
    const mainComments = comments.filter((c) => !c.parentId);

    return (
        <div className="comments-container">
            <h3>Kommentare ({comments.length})</h3>

            {/* Haupt-Formular ohne CSS-Klasse, da die Wrapper-Klasse in CommentFormUI steckt */}
            <CommentFormUI isReply={false} onSubmit={(name, text) => handleAddComment(name, text, null)} />

            <hr />
            <div className="comments-list">
                {mainComments.length === 0 ? (
                    <p>Noch keine Kommentare vorhanden. Mach den Anfang!</p>
                ) : (
                    mainComments.map((comment) => (
                        <SingleComment allComments={comments} comment={comment} onReply={handleAddComment} />
                    ))
                )}
            </div>
        </div>
    );
};

// === 2. REKURSIVE EINZEL-KOMPONENTE ===
const SingleComment = ({
    comment,
    allComments,
    onReply,
}: {
    comment: Comment;
    allComments: Comment[];
    onReply: (name: string, text: string, parentId: string | null) => Promise<void>;
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    // Suche alle direkten Antworten auf diesen speziellen Kommentar
    const replies = allComments
        .filter((c) => c.parentId === comment.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return (
        <div className="comment-wrapper">
            <div className="comment-box">
                <div className="comment-header">
                    <span className="comment-author">{comment.authorName}</span>
                    <span className="comment-date">
                        {comment.createdAt.toLocaleDateString("de-DE")} -{" "}
                        {comment.createdAt.toLocaleTimeString("de-DE")}
                    </span>
                </div>

                <p className="comment-text">{comment.text}</p>

                <button className="reply-toggle-btn" onClick={() => setShowReplyForm(!showReplyForm)} type={"button"}>
                    {showReplyForm ? "Abbrechen ▲" : "Antworten ▼"}
                </button>

                {showReplyForm && (
                    <div className="reply-form-wrapper">
                        <CommentFormUI
                            isReply={true}
                            onSubmit={async (name, text) => {
                                await onReply(name, text, comment.id);
                                setShowReplyForm(false);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* REKURSION: Rendert die Kinder */}
            {replies.length > 0 && (
                <div className="replies-container">
                    {replies.map((reply) => (
                        <SingleComment allComments={allComments} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    );
};

// === 3. FORMULAR UI ===
const CommentFormUI = ({
    onSubmit,
    isReply,
}: {
    onSubmit: (name: string, text: string) => Promise<void>;
    isReply: boolean;
}) => {
    const namePlaceholder = "Anonym";
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [hiddenValue, setHiddenValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: SubmitEvent) => {
        if (hiddenValue.length > 0) {
            return;
        }
        e.preventDefault();
        setSubmitting(true);
        if (name.length > 0) {
            await onSubmit(name, text);
        } else {
            await onSubmit(namePlaceholder, text);
        }
        setText(""); // Textfeld leeren, Name lassen wir oft stehen (UX)
        setSubmitting(false);
    };

    return (
        <form autoComplete={"off"} className="comment-form" onSubmit={handleSubmit}>
            <div className={"form-group hidden"}>
                <input
                    className={"comment-input-h"}
                    id={"comment-input-h"}
                    onInput={(e) => setHiddenValue((e.target as HTMLTextAreaElement).value)}
                    type="text"
                />
            </div>
            <div className="form-group">
                <label htmlFor="comment-input-name">Name (Optional)</label>
                <input
                    className="comment-input"
                    id="comment-input-name"
                    onChange={(e) => setName((e.target as HTMLTextAreaElement).value)}
                    placeholder={namePlaceholder}
                    value={name}
                />
            </div>
            <div className="form-group">
                <label htmlFor="comment-textarea">{isReply ? "Antwort schreiben..." : "Kommentar schreiben..."}</label>
                <textarea
                    className="comment-textarea"
                    id="comment-textarea"
                    onChange={(e) => setText((e.target as HTMLTextAreaElement).value)}
                    placeholder={isReply ? "Antwort schreiben..." : "Kommentar schreiben..."}
                    required
                    rows={4}
                    value={text}
                />
            </div>
            <button className="submit-btn primary" disabled={submitting} type="submit">
                {submitting ? "Sendet..." : isReply ? "Antwort senden" : "Kommentar senden"}
            </button>
        </form>
    );
};
