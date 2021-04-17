import { createAction, props } from '@ngrx/store';

export const minimizeWindow = createAction('[Electron] minimize');

export const maximizeWindow = createAction('[Electron] maximize');

export const closeWindow = createAction('[Electron] close');
