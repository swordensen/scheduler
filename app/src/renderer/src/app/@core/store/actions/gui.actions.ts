import { createAction, props } from '@ngrx/store';

export const toggleSideNav = createAction('[GUI] Toggle Side Nav');

export const startLoading = createAction('[GUI] app is loading');

export const stopLoading = createAction('[GUI] Stop Loading');

export const setFilter = createAction('[GUI] set filter', props<{filter:string}>());

export const toggleClock = createAction('[GUI] Toggle Clock');