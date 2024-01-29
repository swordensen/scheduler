import {SpawnOptions} from 'node:child_process';

export interface TaskAction {
    command:string;
    spawnOptions?: SpawnOptions;
}