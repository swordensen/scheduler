import { GUIState } from '../reducers/gui.reducer';

export const selectSideNavOpen = (state: { gui: GUIState }) =>
  state.gui.sideNavOpen;

export const selectLoading = (state: { gui: GUIState }) => state.gui.loading;

export const selectFilter = (state: {gui: GUIState}) => state.gui.scheduleFilter;

export const selectIsClockAnalog = (state: {gui:GUIState}) => state.gui.isClockAnalog;