import {
  app, Menu, ipcMain, BrowserWindow, shell,
} from 'electron';
import url from 'url';
import path from 'path';
import { writeFile } from 'fs';

import MainWindows from './mainWindow';
import menu from './menu';

import utils from './utils';

const isDevelopment = process.env.NODE_ENV !== 'production';

class ECVApp {
  mainWindow: MainWindows

  playWindow: MainWindows

  createdAppProtocol = false;

  devPath = ''

  prodPath = 'index.html'

  isPlay = false

  constructor() {
    this.mainWindow = null;
    this.playWindow = null;
  }

  init(options = { isPlay: false }) {
    this.isPlay = options.isPlay;
    this.addEventListener();
    this.addIpcEventListener();
  }

  addIpcEventListener() {
    const that = this;

    ipcMain.on(utils.ipcChan.renderSendResizeToMain, () => {
      that.mainWindow.resize();
    });

    ipcMain.on(utils.ipcChan.renderSendTrayDbclickToMain, () => {
      that.mainWindow.showOrHide();
    });

    ipcMain.on(utils.ipcChan.renderSendTrayExitToMain, () => {
      that.exit();
    });

    ipcMain.on(utils.ipcChan.openDevTools, (event, arg) => {
      if (arg.openDevTools) {
        console.log('async-open-dev send arg: ', arg);
        if (!process.env.IS_TEST) {
          const focusedWin = BrowserWindow.getFocusedWindow();
          if (focusedWin !== null) {
            focusedWin.webContents.openDevTools();
          }
        }
      }
      event.sender.send(utils.ipcChan.openDevTools, {
        devtoolsOpend: true,
      });
    });

    ipcMain.on(utils.ipcChan.openGraphqlTools, (event, arg) => {
      if (arg.graphqlServerURL) {
        console.log('async-open-graphql send arg: ', arg);
        if (!process.env.IS_TEST) {
          const focusedWin = BrowserWindow.getFocusedWindow();
          if (focusedWin !== null) {
            focusedWin.loadURL(arg.graphqlServerURL);
          }
        }
      }
      event.sender.send(utils.ipcChan.openGraphqlTools, {
        graphqlServerOpened: true,
      });
    });

    ipcMain.on(utils.ipcChan.setAppMenu, (event, arg) => {
      if (arg.showMenu) {
        console.log('async-show-menu send arg: ', arg);
        const menu = Menu.buildFromTemplate(arg.template);
        Menu.setApplicationMenu(menu);
      } else {
        Menu.setApplicationMenu(menu);
      }
      event.sender.send(utils.ipcChan.setAppMenu, {
        menuOpened: true,
      });
    });

    ipcMain.on(utils.ipcChan.addJumpList, (event, arg) => {
      console.log('async-add-jumplist send arg: ', arg);
      const items = [];
      items.push(arg.item);
      const settings = app.getJumpListSettings();
      console.log(settings);
      app.setJumpList([
        {
          type: 'custom',
          name: 'Recent files',
          items,
        },
      ]);
      // shell.openExternal(arg.item.path);
      event.sender.send(utils.ipcChan.addJumpList, {
        added: true,
      });
    });

    ipcMain.on(utils.ipcChan.printPdf, (event, arg) => {
      console.log('print send arg: ', arg);
      // this.mainWindow.browserWindow.webContents.printToPDF((error: any) => {
      //   if (error) throw error;
      //   shell.openExternal(this.mainWindow.printPdfPath);
      // });
      // shell.openExternal(arg.item.path);
      event.sender.send(utils.ipcChan.printPdf, {
        printed: true,
      });
    });
  }

  addEventListener() {
    this.onAppReady();
    this.onAppWindowAllClosed();
  }

  onAppReady() {
    app.on('ready', async () => {
      if (this.isPlay) {
        this.createPlayWindow();
        await this.installDevtools();
        this.devPath = 'playpage';
        this.prodPath = 'playpage.html';
        this.loadUrl(this.playWindow);
      } else {
        this.createMainWindow();
        await this.installDevtools();
        this.loadUrl(this.mainWindow);
      }
    });
  }

  loadUrl(win: MainWindows | BrowserWindow) {
    if (isDevelopment) {
      win.loadURL(`http://localhost:8080/${this.devPath}`);
    } else {
      win.loadURL(
        url.format({
          // pathname: path.join(__dirname, '../renderer/index.html'),
          pathname: path.join(__dirname, '../index.html'),
          protocol: 'file:',
          slashes: true,
        }),
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async installDevtools() {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
      extensions.map(name => installer.default(installer[name], forceDownload)),
    ).catch(console.log);
  }

  // eslint-disable-next-line class-methods-use-this
  onAppWindowAllClosed() {
    // 当所有窗口被关闭了，退出。
    app.on('window-all-closed', () => {
      // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
      // 应用会保持活动状态
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  createMainWindow() {
    const options = {
      width: 1024,
      height: 768,
      webPreferences: {
        javascript: true,
        plugins: true,
        nodeIntegration: true,
      },
    };
    this.mainWindow = new MainWindows(options);
  }

  createPlayWindow() {
    const options = {
      width: 800,
      height: 600,
    };
    this.playWindow = new MainWindows(options);
  }

  exit() {
    app.exit(0);
  }
}

// bootstrap
export default ECVApp;
