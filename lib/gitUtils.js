import { exec } from '@actions/exec';
import { env } from './env.js';
import { execWithOutput, identify } from './utils.js';
export const setupUser = async (username) => {
    await exec('git', [
        'config',
        'user.name',
        env.GITLAB_CI_USER_NAME || env.GITLAB_USER_NAME || username,
    ]);
    const email = env.GITLAB_CI_USER_EMAIL || `${username}@${env.CI_SERVER_HOST}`;
    await exec('git', ['config', 'user.email', email]);
};
export const pullBranch = async (branch) => {
    await exec('git', ['pull', 'origin', branch]);
};
export const push = async (branch, { force } = {}) => {
    await exec('git', ['push', 'origin', `HEAD:${branch}`, force && '--force'].filter(identify));
};
export const pushTags = async () => {
    await exec('git', ['push', 'origin', '--tags']);
};
export const switchToMaybeExistingBranch = async (branch) => {
    const { stderr } = await execWithOutput('git', ['checkout', branch], {
        ignoreReturnCode: true,
    });
    const isCreatingBranch = !stderr.includes(`Switched to branch '${branch}'`) &&
        !stderr.includes(`Switched to a new branch '${branch}'`);
    if (isCreatingBranch) {
        await exec('git', ['checkout', '-b', branch]);
    }
};
export const reset = async (pathSpec, mode = 'hard') => {
    await exec('git', ['reset', `--${mode}`, pathSpec]);
};
export const commitAll = async (message) => {
    await exec('git', ['add', '-A', '.']);
    await exec('git', ['commit', '-m', message, '--no-verify']);
};
export const checkIfClean = async () => {
    const { stdout } = await execWithOutput('git', ['status', '--porcelain']);
    return stdout.length === 0;
};
//# sourceMappingURL=gitUtils.js.map