import { ChildProcess } from 'child_process';
import { app, BrowserWindow,  } from 'electron';
import path from 'path';


export function createProcessWindow(_process:ChildProcess){

    console.log('creating process window');
      const processWindow = new BrowserWindow({
          width: 800,
          height: 600,
      })
  
      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
          console.log(MAIN_WINDOW_VITE_DEV_SERVER_URL);
          processWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/terminal/');
        } else {
          processWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/terminal/index.html`));
        }
    

    return app;
}