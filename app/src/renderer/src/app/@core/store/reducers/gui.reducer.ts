import { Action, createReducer, on } from '@ngrx/store';
import {
  startLoading,
  stopLoading,
  toggleSideNav,
} from '../actions/gui.actions';

export interface GUIState {
  sideNavOpen: boolean;
  loading: boolean;
}

const initialGUIState: GUIState = {
  sideNavOpen: true,
  loading: false,
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
  }))
);

export function guiReducer(state: GUIState | undefined, action: Action) {
  return _guiReducer(state, action);
}
