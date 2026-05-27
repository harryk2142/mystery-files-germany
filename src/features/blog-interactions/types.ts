export type Comment = {
    id: string;
    authorName: string;
    text: string;
    parentId: string | null | undefined;
    createdAt: Date;
};

// Das ist der Vertrag für jede zukünftige Datenbank!
export type BlogRepository = {
    incrementLikes(slug: string): Promise<void>;
    getLikes(slug: string): Promise<number>; // <-- Neu hinzugefügt
    getComments(slug: string): Promise<Comment[]>;
    getCommentCount(slug: string): Promise<number>;
    addComment(slug: string, comment: Omit<Comment, "id" | "createdAt">): Promise<void>;
};
