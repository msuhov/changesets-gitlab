import type { PreState, NewChangeset } from '@changesets/types';
export interface ChangesetState {
    preState: PreState | undefined;
    changesets: NewChangeset[];
}
export default function readChangesetState(cwd?: string): Promise<ChangesetState>;
