import { Gitlab } from '@gitbeaker/rest';
import { bootstrap } from 'global-agent';
import { env } from './env.js';
const PROXY_PROPS = ['http_proxy', 'https_proxy', 'no_proxy'];
export const createApi = (gitlabToken) => {
    bootstrap();
    for (const prop of PROXY_PROPS) {
        const uProp = prop.toUpperCase();
        const value = process.env[uProp] || process.env[prop];
        if (value) {
            GLOBAL_AGENT[uProp] = value;
        }
    }
    const token = gitlabToken || env.GITLAB_TOKEN;
    const host = env.GITLAB_HOST;
    switch (env.GITLAB_TOKEN_TYPE) {
        case 'job': {
            return new Gitlab({
                host,
                jobToken: token,
            });
        }
        case 'oauth': {
            return new Gitlab({
                host,
                oauthToken: token,
            });
        }
        default: {
            return new Gitlab({
                host,
                token,
            });
        }
    }
};
//# sourceMappingURL=index.js.map