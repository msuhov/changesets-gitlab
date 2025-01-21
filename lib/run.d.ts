interface PublishOptions {
    script: string;
    gitlabToken: string;
    createGitlabReleases?: boolean;
    cwd?: string;
}
interface PublishedPackage {
    name: string;
    version: string;
}
type PublishResult = {
    published: false;
} | {
    published: true;
    publishedPackages: PublishedPackage[];
};
export declare function runPublish({ script, gitlabToken, createGitlabReleases, cwd, }: PublishOptions): Promise<PublishResult>;
interface VersionOptions {
    script?: string;
    gitlabToken: string;
    cwd?: string;
    mrTitle?: string;
    removeSourceBranch?: boolean;
    mrTargetBranch?: string;
    commitMessage?: string;
    hasPublishScript?: boolean;
}
export declare function runVersion({ script, gitlabToken, cwd, mrTitle, mrTargetBranch, commitMessage, removeSourceBranch, hasPublishScript, }: VersionOptions): Promise<void>;
export {};
