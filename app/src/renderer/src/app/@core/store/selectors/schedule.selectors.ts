import { Schedule, Task, TaskGroup } from '../../../../../../main/types';
import { GUIState } from '../reducers/gui.reducer';

function recursiveFilter(taskGroup:TaskGroup, filter:string){
    return {
        ...taskGroup,
        tasks: taskGroup.tasks.reduce((acc, cur)=>{
            if(cur.type === 'taskGroup'){
                acc.push(recursiveFilter(cur, filter))
            } else if(cur.type === 'task'){
                if(cur.name.toLowerCase().includes(filter.toLowerCase())){
                    acc.push(cur);
                }
            }

            return acc;
        }, [] as (TaskGroup | Task)[])
    }
}

export const selectSchedule = (state: { schedule: Schedule, gui:GUIState }) => recursiveFilter(state.schedule, state.gui.scheduleFilter);
