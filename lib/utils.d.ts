/// <reference types="node" />
import type { Gitlab } from '@gitbeaker/core';
import type { Package } from '@manypkg/get-packages';
export declare const BumpLevels: {
    readonly dep: 0;
    readonly patch: 1;
    readonly minor: 2;
    readonly major: 3;
};
export declare function getVersionsByDirectory(cwd: string): Promise<Map<string, string>>;
export declare function getChangedPackages(cwd: string, previousVersions: Map<string, string>): Promise<Package[]>;
export declare function getChangelogEntry(changelog: string, version: string): {
    content: string;
    highestLevel: number;
};
export declare function execWithOutput(command: string, args?: string[], options?: {
    ignoreReturnCode?: boolean;
    cwd?: string;
}): Promise<{
    code: number;
    stdout: string;
    stderr: string;
}>;
export declare function sortTheThings(a: {
    private: boolean;
    highestLevel: number;
}, b: {
    private: boolean;
    highestLevel: number;
}): number;
export declare const identify: <T>(_: T) => _ is Exclude<T, "" | (T extends boolean ? false : boolean) | null | undefined>;
export declare function getAllFiles(dir: string, base?: string): Promise<string[]>;
export declare const execSync: (command: string) => Buffer;
export declare const getOptionalInput: (name: string) => string | undefined;
export declare const getUsername: (api: Gitlab) => string | Promise<string>;
