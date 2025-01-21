import { execSync as _execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { getInput } from '@actions/core';
import { exec } from '@actions/exec';
import { getPackages } from '@manypkg/get-packages';
import { toString as mdastToString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { env } from './env.js';
export const BumpLevels = {
    dep: 0,
    patch: 1,
    minor: 2,
    major: 3,
};
export async function getVersionsByDirectory(cwd) {
    const { packages } = await getPackages(cwd);
    return new Map(packages.map(x => [x.dir, x.packageJson.version]));
}
export async function getChangedPackages(cwd, previousVersions) {
    const { packages } = await getPackages(cwd);
    const changedPackages = new Set();
    for (const pkg of packages) {
        const previousVersion = previousVersions.get(pkg.dir);
        if (previousVersion !== pkg.packageJson.version) {
            changedPackages.add(pkg);
        }
    }
    return [...changedPackages];
}
export function getChangelogEntry(changelog, version) {
    const ast = unified().use(remarkParse).parse(changelog);
    let highestLevel = BumpLevels.dep;
    const nodes = ast.children;
    let headingStartInfo;
    let endIndex;
    for (const [i, node] of nodes.entries()) {
        if (node.type === 'heading') {
            const stringified = mdastToString(node);
            const match = /(major|minor|patch)/.exec(stringified.toLowerCase());
            if (match !== null) {
                const level = BumpLevels[match[0]];
                highestLevel = Math.max(level, highestLevel);
            }
            if (headingStartInfo === undefined && stringified === version) {
                headingStartInfo = {
                    index: i,
                    depth: node.depth,
                };
                continue;
            }
            if (endIndex === undefined &&
                headingStartInfo !== undefined &&
                headingStartInfo.depth === node.depth) {
                endIndex = i;
                break;
            }
        }
    }
    if (headingStartInfo) {
        ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
    }
    return {
        content: unified().use(remarkStringify).stringify(ast),
        highestLevel,
    };
}
export async function execWithOutput(command, args, options) {
    let myOutput = '';
    let myError = '';
    return {
        code: await exec(command, args, {
            listeners: {
                stdout: (data) => {
                    myOutput += data.toString();
                },
                stderr: (data) => {
                    myError += data.toString();
                },
            },
            ...options,
        }),
        stdout: myOutput,
        stderr: myError,
    };
}
export function sortTheThings(a, b) {
    if (a.private === b.private) {
        return b.highestLevel - a.highestLevel;
    }
    if (a.private) {
        return 1;
    }
    return -1;
}
export const identify = (_) => !!_;
export async function getAllFiles(dir, base = dir) {
    const direntList = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(direntList.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory()
            ? getAllFiles(res, base)
            : [path.relative(base, res)];
    }));
    return files.flat().filter(f => !f.includes('node_modules'));
}
export const execSync = (command) => _execSync(command, {
    stdio: 'inherit',
});
export const getOptionalInput = (name) => getInput(name) || undefined;
export const getUsername = (api) => {
    return (env.GITLAB_CI_USER_NAME ??
        api.Users.showCurrentUser().then(currentUser => currentUser.username));
};
//# sourceMappingURL=utils.js.map