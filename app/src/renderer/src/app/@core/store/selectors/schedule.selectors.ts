import { Schedule } from '../../../../../../main/types';
import { GUIState } from '../reducers/gui.reducer';

export const selectSchedule = (state: { schedule: Schedule, gui:GUIState }) => state.schedule.filter(task => task.name.includes(state.gui.scheduleFilter));
