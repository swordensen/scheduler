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

function getTaskByTaskId(taskGroup:TaskGroup, id:string){
    for(const subTask of taskGroup.tasks){
        if(subTask.type === 'task' && subTask.id == id) return subTask;
        if(subTask.type === 'taskGroup'){
            return getTaskByTaskId(subTask, id);
        }
    }
    return null;
}



export const selectSchedule = (state: { schedule: Schedule, gui:GUIState }) => recursiveFilter(state.schedule, state.gui.scheduleFilter);

export const selectTaskById = (id:string) => (state: {schedule:Schedule}) => getTaskByTaskId(state.schedule, id)
