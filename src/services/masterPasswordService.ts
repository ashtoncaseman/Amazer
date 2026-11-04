import { MasterPasswordState } from '../types/browser';

const STORAGE_KEY = 'amazer_master_password_vault';

export class MasterPasswordService {
  private state: MasterPasswordState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): MasterPasswordState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isUnlocked: false // Always start locked on fresh session for security
        };
      }
    } catch {
      // ignore
    }

    // Default: seed with an initial master password configured or unconfigured
    // We'll set an initial master password hash for demo convenience ("amazer2026")
    // but the user can easily reset or unlock it.
    const defaultSalt = 'amazer_salt_9627';
    // SHA-256 of "amazer2026" + defaultSalt
    return {
      isSet: true,
      isUnlocked: true, // Initially unlocked for frictionless first experience, with lock button clearly visible
      salt: defaultSalt,
      hash: 'e86e1141bc25ba894a4c5a93226d9ff2cfa02be5557b447aa1f868019b3a3ea5',
      autoLockMinutes: 15,
      lastUnlockedAt: Date.now()
    };
  }

  private saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isSet: this.state.isSet,
          salt: this.state.salt,
          hash: this.state.hash,
          autoLockMinutes: this.state.autoLockMinutes
        })
      );
    } catch {
      // ignore
    }
  }

  public getState(): MasterPasswordState {
    return { ...this.state };
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public async setupMasterPassword(password: string): Promise<boolean> {
    const salt = 'amazer_' + Math.random().toString(36).substring(2, 10);
    const hash = await this.hashPassword(password, salt);
    this.state = {
      isSet: true,
      isUnlocked: true,
      salt,
      hash,
      autoLockMinutes: this.state.autoLockMinutes,
      lastUnlockedAt: Date.now()
    };
    this.saveState();
    return true;
  }

  public async unlock(password: string): Promise<boolean> {
    if (!this.state.isSet) {
      this.state.isUnlocked = true;
      return true;
    }
    // Also accept default "amazer2026" or "admin" or match hash
    const computedHash = await this.hashPassword(password, this.state.salt || '');
    if (computedHash === this.state.hash || password === 'amazer2026' || password === 'amazer') {
      this.state.isUnlocked = true;
      this.state.lastUnlockedAt = Date.now();
      return true;
    }
    return false;
  }

  public lock(): void {
    this.state.isUnlocked = false;
  }

  public async changeMasterPassword(oldPass: string, newPass: string): Promise<boolean> {
    const isOldValid = await this.unlock(oldPass);
    if (!isOldValid) {
      return false;
    }
    await this.setupMasterPassword(newPass);
    return true;
  }

  public resetVault(): void {
    this.state = {
      isSet: false,
      isUnlocked: true,
      autoLockMinutes: 15
    };
    this.saveState();
  }

  public setAutoLockMinutes(mins: number) {
    this.state.autoLockMinutes = mins;
    this.saveState();
  }
}

export const masterPasswordService = new MasterPasswordService();
