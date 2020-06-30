/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
import {
  app, shell, Menu, MenuItemConstructorOptions, BrowserWindow,
} from 'electron';
import MainWindows from './mainWindow';

const menuTemplates: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'UMI UI',
        accelerator: 'CmdOrCtrl+U',
        click() {
          const newWin = new MainWindows({});
          newWin.loadURL('http://127.0.0.1:3000');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'New Graphql',
        accelerator: 'CmdOrCtrl+N',
        click() {
          const newWin = new MainWindows({});
          newWin.loadURL('http://127.0.0.1:4000/graphql');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Close Window',
        accelerator: 'Shift+CmdOrCtrl+W',
        click() {
          (BrowserWindow.getFocusedWindow() as any).close();
        },
      },
      {
        label: 'Print',
        accelerator: 'Shift+CmdOrCtrl+P',
        click() {
          (BrowserWindow.getFocusedWindow() as any).webContents.print();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          }
          return 'F11';
        }()),
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          }
          return 'Ctrl+Shift+I';
        }()),
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
      },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Report an Issue...',
        click() {
          shell.openExternal('mailto:linuxing3@qq.com');
        },
      },
      {
        label: 'Learn More',
        click() {
          shell.openExternal('https://embajadachinave.netlify.com');
        },
      },
    ],
  },
];

let baseIndex = 0;
if (process.platform === 'darwin') {
  baseIndex = 1;
  menuTemplates.unshift({
    label: app.getName(),
    submenu: [
      {
        label: `About ${app.getName()}`,
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        label: `Hide ${app.getName()}`,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideOthers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        },
      },
    ],
  });
}

const menu = Menu.buildFromTemplate(menuTemplates);

export default menu;
