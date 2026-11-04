import { SyncDevice, SyncSettings } from '../types/browser';

export class SyncEngine {
  public static generateSyncKey(): string {
    const chars = 'abcdef0123456789';
    let key = 'amz_sync_';
    for (let i = 0; i < 24; i++) {
      if (i > 0 && i % 4 === 0) key += '_';
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
  }

  public static simulateDeviceSync(
    devices: SyncDevice[],
    settings: SyncSettings
  ): { updatedDevices: SyncDevice[]; updatedSettings: SyncSettings; syncedRecordsCount: number } {
    const now = Date.now();
    const updatedDevices = devices.map(d => ({
      ...d,
      lastSync: now,
      status: 'synced' as const
    }));

    const updatedSettings = {
      ...settings,
      lastGlobalSync: now
    };

    // Calculate how many records were cross-checked
    const syncedRecordsCount = Math.floor(Math.random() * 8) + 12;

    return {
      updatedDevices,
      updatedSettings,
      syncedRecordsCount
    };
  }

  public static addDevice(
    devices: SyncDevice[],
    name: string,
    type: 'desktop' | 'laptop' | 'mobile'
  ): SyncDevice[] {
    const newDevice: SyncDevice = {
      id: `dev-${Date.now()}`,
      name,
      type,
      lastSync: Date.now(),
      isCurrent: false,
      ip: `192.168.1.${Math.floor(Math.random() * 150) + 50}`,
      status: 'synced'
    };
    return [...devices, newDevice];
  }

  public static removeDevice(devices: SyncDevice[], id: string): SyncDevice[] {
    return devices.filter(d => d.id !== id);
  }
}
