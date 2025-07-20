import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import type { Settings } from '../../../client/src/typings.d';

export function readSettings(settingsFilePath: string): Settings | null {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(data) as Settings;
    }
    return null;
  } catch (error) {
    console.error('Failed to read settings file:', error);
    return null;
  }
}

export function registerSettingsHandlers(userDataPath: string): void {
  const settingsFilePath = path.join(userDataPath, 'settings.json');

  ipcMain.on('save-settings', (event, settings: Settings) => {
    try {
      fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
    } catch (err) {
      console.error('Failed to save settings:', err instanceof Error ? err.message : err);
    }
  });
  
  ipcMain.handle('load-settings', async (): Promise<Settings> => {
    const settings = readSettings(settingsFilePath);
    return settings || {} as Settings;
  });
}