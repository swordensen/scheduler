import { Action, createReducer, on } from '@ngrx/store';
import {
  setFilter,
  startLoading,
  stopLoading,
  toggleClock,
  toggleSideNav,
} from '../actions/gui.actions';

export interface GUIState {
  sideNavOpen: boolean;
  loading: boolean;
  isClockAnalog:boolean;
  scheduleFilter:string;
}

const initialGUIState: GUIState = {
  sideNavOpen: true,
  loading: false,
  isClockAnalog: false,
  scheduleFilter: '',
};

const _guiReducer = createReducer(
  initialGUIState,
  on(toggleSideNav, (state) => ({
    ...state,
    sideNavOpen: !state.sideNavOpen,
  })),
  on(startLoading, (state) => ({
    ...state,
    loading: true,
  })),
  on(stopLoading, (state) => ({
    ...state,
    loading: false,
  })),
  on(setFilter,(state, props)=> ({
    ...state,
    scheduleFilter: props.filter
  })),
  on(toggleClock, (state) => ({
    ...state,
    isClockAnalog: !state.isClockAnalog
  }))
);

export function guiReducer(state: GUIState | undefined, action: Action) {
  return _guiReducer(state, action);
}
