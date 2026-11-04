import { EasyListRule, ScamPopupEvent } from '../types/browser';

export const DEFAULT_EASYLIST_RULES: EasyListRule[] = [
  // Core Ads
  {
    id: 'el-1',
    rawSyntax: '||doubleclick.net^$third-party',
    pattern: 'doubleclick.net',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 247,
    description: 'Google DoubleClick ad serving platform'
  },
  {
    id: 'el-2',
    rawSyntax: '||googleadservices.com^',
    pattern: 'googleadservices.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 184,
    description: 'Google Ad Services network requests'
  },
  {
    id: 'el-3',
    rawSyntax: '||pagead2.googlesyndication.com^',
    pattern: 'googlesyndication.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 312,
    description: 'AdSense banner and responsive ad script loader'
  },
  {
    id: 'el-4',
    rawSyntax: '||outbrain.com^$ad',
    pattern: 'outbrain.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 95,
    description: 'Outbrain sponsored content widgets'
  },
  {
    id: 'el-5',
    rawSyntax: '||taboola.com^$ad',
    pattern: 'taboola.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 118,
    description: 'Taboola clickbait feed network'
  },
  {
    id: 'el-6',
    rawSyntax: '||adroll.com^',
    pattern: 'adroll.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 64,
    description: 'AdRoll retargeting and marketing pixel'
  },
  {
    id: 'el-7',
    rawSyntax: '||criteo.com^',
    pattern: 'criteo.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 88,
    description: 'Criteo dynamic commerce ads and behavioral tracker'
  },
  {
    id: 'el-8',
    rawSyntax: '||amazon-adsystem.com^',
    pattern: 'amazon-adsystem.com',
    type: 'network',
    category: 'ads',
    enabled: true,
    hitCount: 142,
    description: 'Amazon Advertising and Publisher Services'
  },

  // Scam & Pop-up Killers
  {
    id: 'el-scam-1',
    rawSyntax: '||popcash.net^$popup',
    pattern: 'popcash.net',
    type: 'popup',
    category: 'scam',
    enabled: true,
    hitCount: 38,
    description: 'Malicious background pop-under ad network'
  },
  {
    id: 'el-scam-2',
    rawSyntax: '||propellerads.com^$popup',
    pattern: 'propellerads.com',
    type: 'popup',
    category: 'scam',
    enabled: true,
    hitCount: 52,
    description: 'Aggressive interstitial and scam redirect provider'
  },
  {
    id: 'el-scam-3',
    rawSyntax: '||urgent-security-warning.xyz^$popup',
    pattern: 'urgent-security-warning',
    type: 'popup',
    category: 'scam',
    enabled: true,
    hitCount: 19,
    description: 'Fake tech-support Windows/Mac virus alert lockup'
  },
  {
    id: 'el-scam-4',
    rawSyntax: '||claim-prize-rewards.net^$popup',
    pattern: 'claim-prize-rewards',
    type: 'popup',
    category: 'scam',
    enabled: true,
    hitCount: 23,
    description: 'Fake lottery spin & survey gift card phishing trap'
  },
  {
    id: 'el-scam-5',
    rawSyntax: '||ad-shield-cleaner-install.info^$popup',
    pattern: 'ad-shield-cleaner-install',
    type: 'popup',
    category: 'scam',
    enabled: true,
    hitCount: 14,
    description: 'Rogue cleaner software scareware download'
  },
  {
    id: 'el-scam-6',
    rawSyntax: '||browser-update-urgent.online^$popup',
    pattern: 'browser-update-urgent',
    type: 'popup',
    category: 'scam',
    enabled: true,
    hitCount: 27,
    description: 'Fake browser update malware dropper'
  },

  // Privacy & Tracking
  {
    id: 'el-priv-1',
    rawSyntax: '||hotjar.com^$script',
    pattern: 'hotjar.com',
    type: 'network',
    category: 'privacy',
    enabled: true,
    hitCount: 83,
    description: 'Hotjar session recording and keylogger tracker'
  },
  {
    id: 'el-priv-2',
    rawSyntax: '||clarity.ms^$script',
    pattern: 'clarity.ms',
    type: 'network',
    category: 'privacy',
    enabled: true,
    hitCount: 104,
    description: 'Microsoft Clarity behavioral session tracker'
  },
  {
    id: 'el-priv-3',
    rawSyntax: '||facebook.net/tr^$image',
    pattern: 'facebook.net/tr',
    type: 'network',
    category: 'privacy',
    enabled: true,
    hitCount: 261,
    description: 'Meta / Facebook Pixel cross-site identifier'
  },
  {
    id: 'el-priv-4',
    rawSyntax: '||yandex.ru/metrika^',
    pattern: 'yandex.ru/metrika',
    type: 'network',
    category: 'privacy',
    enabled: true,
    hitCount: 31,
    description: 'Yandex Metrika session spy tracker'
  },

  // Cosmetic & Annoyances
  {
    id: 'el-cos-1',
    rawSyntax: '###cookie-banner',
    pattern: '#cookie-banner',
    type: 'cosmetic',
    category: 'annoyances',
    enabled: true,
    hitCount: 175,
    description: 'Generic cookie compliance modal dialogs'
  },
  {
    id: 'el-cos-2',
    rawSyntax: '##.ad-placement-top',
    pattern: '.ad-placement-top',
    type: 'cosmetic',
    category: 'ads',
    enabled: true,
    hitCount: 189,
    description: 'Sticky top advertisement frames'
  },
  {
    id: 'el-cos-3',
    rawSyntax: '##.sponsored-post',
    pattern: '.sponsored-post',
    type: 'cosmetic',
    category: 'ads',
    enabled: true,
    hitCount: 92,
    description: 'In-feed sponsored advertorial elements'
  },

  // Whitelist sample
  {
    id: 'el-wl-1',
    rawSyntax: '@@||github.com^',
    pattern: 'github.com',
    type: 'whitelist',
    category: 'ads',
    enabled: true,
    hitCount: 0,
    description: 'Whitelisted developer ecosystem domain'
  }
];

export class EasyListEngine {
  private rules: EasyListRule[];
  private scamEvents: ScamPopupEvent[] = [];

  constructor(initialRules: EasyListRule[] = DEFAULT_EASYLIST_RULES) {
    this.rules = [...initialRules];
  }

  public getRules(): EasyListRule[] {
    return this.rules;
  }

  public setRules(rules: EasyListRule[]) {
    this.rules = rules;
  }

  public toggleRule(id: string): EasyListRule[] {
    this.rules = this.rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    return this.rules;
  }

  public addCustomRule(rawSyntax: string, category: EasyListRule['category'] = 'ads'): EasyListRule {
    const trimmed = rawSyntax.trim();
    let type: EasyListRule['type'] = 'network';

    if (trimmed.startsWith('@@')) {
      type = 'whitelist';
    } else if (trimmed.includes('##') || trimmed.includes('#?#')) {
      type = 'cosmetic';
    } else if (trimmed.includes('$popup') || trimmed.toLowerCase().includes('popup')) {
      type = 'popup';
    }

    // Extract pattern
    let pattern = trimmed
      .replace(/^@@/, '')
      .replace(/^\|\|/, '')
      .replace(/\^.*$/, '')
      .replace(/##.*$/, '')
      .replace(/\$.*$/, '');

    const newRule: EasyListRule = {
      id: 'custom-' + Date.now(),
      rawSyntax: trimmed,
      pattern: pattern || trimmed,
      type,
      category,
      enabled: true,
      hitCount: 0,
      description: `User defined rule for ${pattern || trimmed}`
    };

    this.rules.unshift(newRule);
    return newRule;
  }

  public deleteRule(id: string): EasyListRule[] {
    this.rules = this.rules.filter(r => r.id !== id);
    return this.rules;
  }

  public resetToDefaults(): EasyListRule[] {
    this.rules = [...DEFAULT_EASYLIST_RULES];
    return this.rules;
  }

  /**
   * Tests a URL against current EasyList rules
   */
  public evaluateRequest(url: string): {
    blocked: boolean;
    rule?: EasyListRule;
    category?: EasyListRule['category'];
    reason?: string;
  } {
    const cleanUrl = url.toLowerCase();

    // Check whitelists first
    for (const rule of this.rules) {
      if (rule.enabled && rule.type === 'whitelist') {
        if (cleanUrl.includes(rule.pattern.toLowerCase())) {
          return { blocked: false };
        }
      }
    }

    // Check blocking rules
    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      const pattern = rule.pattern.toLowerCase();
      if (pattern && cleanUrl.includes(pattern)) {
        rule.hitCount++;
        return {
          blocked: true,
          rule,
          category: rule.category,
          reason: `Blocked by EasyList rule: ${rule.rawSyntax}`
        };
      }
    }

    // Generalized heuristic check for common ad / tracker paths
    const adKeywords = ['/ads/', '/adserver', 'banner_id=', 'affiliate_click', 'pixel.gif', 'doubleclick', 'telemetry.min.js'];
    for (const kw of adKeywords) {
      if (cleanUrl.includes(kw)) {
        return {
          blocked: true,
          category: 'ads',
          reason: `Blocked by Amazer Heuristic Ad Filter (${kw})`
        };
      }
    }

    return { blocked: false };
  }

  /**
   * Evaluates and blocks scam pop-ups, fake alert dialogs, or unsolicited new window opens
   */
  public evaluatePopup(targetUrl: string, sourceUrl: string): {
    allowed: boolean;
    reason: string;
    event?: ScamPopupEvent;
  } {
    const lowerTarget = targetUrl.toLowerCase();

    const scamPatterns = [
      { pattern: 'prize', reason: 'Fake Prize / Sweepstakes Scam' },
      { pattern: 'warning', reason: 'Urgent Tech-Support Virus Scareware' },
      { pattern: 'cleaner', reason: 'Unsolicited System Cleaner Malware' },
      { pattern: 'popcash', reason: 'Forced Pop-under Redirect Network' },
      { pattern: 'propellerads', reason: 'High-risk Advertising Interstitial' },
      { pattern: 'security-alert', reason: 'Phishing Browser Lockout Scam' },
      { pattern: 'update-urgent', reason: 'Fake Software / Codec Update Trojan' },
      { pattern: 'spin-win', reason: 'Lottery Phishing Survey' },
      { pattern: 'free-crypto', reason: 'Cryptocurrency Wallet Drainer Scam' }
    ];

    for (const scam of scamPatterns) {
      if (lowerTarget.includes(scam.pattern)) {
        const event: ScamPopupEvent = {
          id: 'scam-' + Date.now() + Math.random().toString(36).substring(2, 6),
          sourceUrl,
          attemptedUrl: targetUrl,
          reason: scam.reason,
          timestamp: Date.now(),
          severity: 'critical'
        };
        this.scamEvents.unshift(event);
        return { allowed: false, reason: scam.reason, event };
      }
    }

    // Also check standard network rules
    const netEval = this.evaluateRequest(targetUrl);
    if (netEval.blocked) {
      const event: ScamPopupEvent = {
        id: 'scam-' + Date.now(),
        sourceUrl,
        attemptedUrl: targetUrl,
        reason: netEval.reason || 'Blocked advertising popup',
        timestamp: Date.now(),
        severity: 'high'
      };
      this.scamEvents.unshift(event);
      return { allowed: false, reason: event.reason, event };
    }

    return { allowed: true, reason: 'Allowed' };
  }

  public getScamEvents(): ScamPopupEvent[] {
    return this.scamEvents;
  }

  public clearScamEvents() {
    this.scamEvents = [];
  }
}

export const easyListEngine = new EasyListEngine();
