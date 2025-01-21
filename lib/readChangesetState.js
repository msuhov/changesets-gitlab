import { readPreState } from '@changesets/pre';
import _readChangesets from '@changesets/read';
const readChangesets = (_readChangesets.default ||
    _readChangesets);
export default async function readChangesetState(cwd = process.cwd()) {
    const preState = await readPreState(cwd);
    const isInPreMode = preState !== undefined && preState.mode === 'pre';
    let changesets = await readChangesets(cwd);
    if (isInPreMode) {
        const changesetsToFilter = new Set(preState.changesets);
        changesets = changesets.filter(x => !changesetsToFilter.has(x.id));
    }
    return {
        preState: isInPreMode ? preState : undefined,
        changesets,
    };
}
//# sourceMappingURL=readChangesetState.js.map