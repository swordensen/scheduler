import { createAction } from '@ngrx/store';

export const toggleSideNav = createAction('[GUI] Toggle Side Nav');

export const startLoading = createAction('[GUI] app is loading');

export const stopLoading = createAction('[GUI] Stop Loading');
