import type { Gitlab } from '@gitbeaker/core';
export declare const getChangedPackages: ({ changedFiles: changedFilesPromise, }: {
    changedFiles: Promise<string[]> | string[];
    api: Gitlab;
}) => Promise<{
    changedPackages: string[];
    releasePlan: import("@changesets/types").ReleasePlan;
}>;
