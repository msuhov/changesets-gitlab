import nodePath from 'node:path';
import _assembleReleasePlan from '@changesets/assemble-release-plan';
import { parse as parseConfig } from '@changesets/config';
import _parseChangeset from '@changesets/parse';
import fs from 'fs-extra';
import { load } from 'js-yaml';
import micromatch from 'micromatch';
import { getAllFiles } from './utils.js';
const assembleReleasePlan = (_assembleReleasePlan.default ||
    _assembleReleasePlan);
const parseChangeset = (_parseChangeset.default ||
    _parseChangeset);
export const getChangedPackages = async ({ changedFiles: changedFilesPromise, }) => {
    let hasErrored = false;
    function fetchFile(path) {
        return fs.readFile(path, 'utf8');
    }
    function fetchJsonFile(path) {
        return fetchFile(path)
            .then(x => JSON.parse(x))
            .catch((err) => {
            hasErrored = true;
            console.error(err);
            return {};
        });
    }
    function fetchTextFile(path) {
        return fetchFile(path).catch((err) => {
            hasErrored = true;
            console.error(err);
            return '';
        });
    }
    async function getPackage(pkgPath) {
        const jsonContent = await fetchJsonFile(nodePath.join(pkgPath, 'package.json'));
        return {
            packageJson: jsonContent,
            dir: pkgPath,
        };
    }
    const rootPackageJsonContentsPromise = fetchJsonFile('package.json');
    const configPromise = fetchJsonFile('.changeset/config.json');
    const tree = await getAllFiles(process.cwd());
    let preStatePromise;
    const changesetPromises = [];
    const potentialWorkspaceDirectories = [];
    let isPnpm = false;
    const changedFiles = await changedFilesPromise;
    for (const item of tree) {
        if (item.endsWith('/package.json') && !item.includes('node_modules')) {
            const dirPath = nodePath.dirname(item);
            potentialWorkspaceDirectories.push(dirPath);
        }
        else if (item === 'pnpm-workspace.yaml') {
            isPnpm = true;
        }
        else if (item.endsWith('.changeset/pre.json')) {
            preStatePromise = fetchJsonFile('.changeset/pre.json');
        }
        else if (!item.endsWith('.changeset/README.md') &&
            item.startsWith('.changeset') &&
            item.endsWith('.md') &&
            changedFiles.some(x => x.endsWith(item))) {
            const res = /\.changeset\/([^.]+)\.md/.exec(item);
            if (!res) {
                throw new Error('could not get name from changeset filename');
            }
            const id = res[1];
            changesetPromises.push(fetchTextFile(item).then(text => ({
                ...parseChangeset(text),
                id,
            })));
        }
    }
    let tool;
    if (isPnpm) {
        tool = {
            tool: 'pnpm',
            globs: load(await fetchTextFile('pnpm-workspace.yaml')).packages,
        };
    }
    else {
        const rootPackageJsonContent = await rootPackageJsonContentsPromise;
        if (rootPackageJsonContent.workspaces) {
            tool = {
                tool: 'yarn',
                globs: Array.isArray(rootPackageJsonContent.workspaces)
                    ? rootPackageJsonContent.workspaces
                    : rootPackageJsonContent.workspaces.packages,
            };
        }
        else if (rootPackageJsonContent.bolt?.workspaces) {
            tool = {
                tool: 'bolt',
                globs: rootPackageJsonContent.bolt.workspaces,
            };
        }
    }
    const rootPackageJsonContent = await rootPackageJsonContentsPromise;
    const packages = {
        root: {
            dir: '/',
            packageJson: rootPackageJsonContent,
        },
        tool: tool ? tool.tool : 'root',
        packages: [],
    };
    if (tool) {
        if (!Array.isArray(tool.globs) ||
            !tool.globs.every(x => typeof x === 'string')) {
            throw new Error('globs are not valid: ' + JSON.stringify(tool.globs));
        }
        const matches = micromatch(potentialWorkspaceDirectories, tool.globs);
        packages.packages = await Promise.all(matches.map(dir => getPackage(dir)));
    }
    else {
        packages.packages.push(packages.root);
    }
    if (hasErrored) {
        throw new Error('an error occurred when fetching files');
    }
    const config = await configPromise.then(rawConfig => parseConfig(rawConfig, packages));
    const releasePlan = assembleReleasePlan(await Promise.all(changesetPromises), packages, config, await preStatePromise);
    return {
        changedPackages: (packages.tool === 'root'
            ? packages.packages
            : packages.packages.filter(pkg => changedFiles.some(changedFile => changedFile.includes(pkg.dir))))
            .filter(pkg => pkg.packageJson.private !== true &&
            !config.ignore.includes(pkg.packageJson.name))
            .map(x => x.packageJson.name),
        releasePlan,
    };
};
//# sourceMappingURL=get-changed-packages.js.map