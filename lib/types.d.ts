export interface MainCommandOptions {
    published?: string;
    onlyChangesets?: string;
    cwd?: string;
}
export type LooseString<T extends string> = T | (string & {});
export type Env = GitLabCIPredefinedVariables & MergeRequestVariables & {
    GITLAB_HOST: string;
    GITLAB_TOKEN: string;
    GITLAB_TOKEN_TYPE: LooseString<'job' | 'oauth'>;
    GITLAB_CI_USER_NAME?: string;
    GITLAB_CI_USER_EMAIL: string;
    CI_SERVER_HOST: string;
    GITLAB_COMMENT_TYPE: LooseString<'discussion' | 'note'>;
    GITLAB_ADD_CHANGESET_MESSAGE?: string;
    DEBUG_GITLAB_CREDENTIAL: LooseString<'1' | 'true'>;
    HOME: string;
    NPM_TOKEN?: string;
};
type MergeRequestVariables = {
    CI_MERGE_REQUEST_SOURCE_BRANCH_NAME: undefined;
} | {
    CI_MERGE_REQUEST_IID: number;
    CI_MERGE_REQUEST_PROJECT_URL: string;
    CI_MERGE_REQUEST_SOURCE_BRANCH_NAME: string;
    CI_MERGE_REQUEST_SOURCE_BRANCH_SHA: string;
    CI_MERGE_REQUEST_TITLE: string;
};
type GitLabCIPredefinedVariables = {
    GITLAB_USER_NAME: string;
} & ({
    CI: undefined;
} | {
    CI: 'true';
    CI_PROJECT_PATH: string;
    CI_SERVER_URL: string;
});
export {};
