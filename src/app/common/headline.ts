export interface Headline {
    id: number;
    subject: string;
    postedBy: string;
    body: string;
    postActiveDate: string | null;
    postRemoveDate: string | null; // ISO date string or null
    postDeleteDate: string | null; // ISO date string or null
    sharedUsers: string[];
    collaborators: string[];
}

