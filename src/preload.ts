// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { RENDERER_EVENT_API_KEY } from "./events/rendererEventAPI";
import rendererEventAPI from './events/rendererEventAPI';

contextBridge.exposeInMainWorld(RENDERER_EVENT_API_KEY, rendererEventAPI)