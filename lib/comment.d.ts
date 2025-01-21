/// <reference types="web" />
import type { DiscussionSchema, MergeRequestNoteSchema } from '@gitbeaker/rest';
export interface GitLabAPIError extends Error {
    cause: {
        description: string;
        request: Request;
        response: Response;
    };
}
export declare const comment: () => Promise<DiscussionSchema | MergeRequestNoteSchema | import("@gitbeaker/core").MergeRequestDiscussionNoteSchema | undefined>;
