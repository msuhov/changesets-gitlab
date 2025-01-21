declare global {
    const GLOBAL_AGENT: {
        HTTP_PROXY: string | null;
        HTTPS_PROXY: string | null;
        NO_PROXY: string | null;
    };
}
export declare const createApi: (gitlabToken?: string) => import("@gitbeaker/core").Gitlab<false>;
