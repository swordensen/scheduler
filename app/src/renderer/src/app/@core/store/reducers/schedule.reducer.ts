import { Action, createReducer, on } from '@ngrx/store';
import {
  setSchedule,
  taskAdded,
  taskDeleted,
  taskFailed,
  taskStarted,
  taskUpdated,
  taskWaiting,
} from '../actions/schedule.actions';
import { Schedule, TaskGroup, Task } from '../../../../../../main/types';

const initialScheduleState: Schedule = {
  id:'',
  type: 'taskGroup',
  description: '',
  name: '',
  tasks: []
};

function taskMap(schedule:Schedule,cb:(task:Task)=>Task | undefined){
  function recurse(taskGroup:Readonly<TaskGroup>):TaskGroup{
    return {
      ...taskGroup,
      tasks: taskGroup.tasks.reduce((acc, cur) => {
        if(cur.type === 'task'){
          const newTask = cb(cur);
          if(newTask){
            acc.push(newTask);
          }
        }else if(cur.type === 'taskGroup'){
          acc.push(recurse(cur));
        } else {
          acc.push(cur)
        }

        return acc;
      }, [] as (Task|TaskGroup)[])
    }
  }

    const newSchedule:Schedule = recurse(schedule);

    return newSchedule;
}

const _scheduleReducer = createReducer(
  initialScheduleState,
  on(setSchedule, (state, { schedule }) => {
    console.log('updating schedule state with new schedule')
    
    return schedule
  }),
  on(taskStarted, (state, { task }) => 
    taskMap(state, (_task)=>{
      if(_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskWaiting, (state, { task }) =>
    taskMap(state, (_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskFailed, (state, { task }) =>
    taskMap(state, (_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskAdded, (state, { task }) => ({
    ...state,
    tasks: [
      ...state.tasks,
      task
    ]
  })),
  on(taskUpdated, (state, { task }) =>
    taskMap(state, (_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskDeleted, (state, { task }) =>
    taskMap(state, ( _task) => {
      if (_task.id !== task.id) return _task;
      return undefined;
    })
  )
);

export function scheduleReducer(state: Schedule | undefined, action: Action) {
  return _scheduleReducer(state, action);
}
