import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AccessibilitySettings {
  grayscale: boolean;
  highContrast: boolean;
  protanopiaFilter: boolean;
  deuteranopiaFilter: boolean;
  tritanopiaFilter: boolean;
  screenReader: boolean;
}

export interface ThemeSettings {
  mode: 'bright' | 'dark';
  primaryColor?: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private themeKey = 'mi-proyecto-theme';
  private accessibilityKey = 'mi-proyecto-accessibility';

  public theme$ = new BehaviorSubject<ThemeSettings>(this.loadTheme());
  public accessibility$ = new BehaviorSubject<AccessibilitySettings>(this.loadAccessibility());

  constructor() {
    // Apply initial values
    this.applyTheme(this.theme$.value);
    this.applyAccessibility(this.accessibility$.value);
  }

  setTheme(s: ThemeSettings) {
    this.theme$.next(s);
    localStorage.setItem(this.themeKey, JSON.stringify(s));
    this.applyTheme(s);
  }

  setAccessibility(a: AccessibilitySettings) {
    this.accessibility$.next(a);
    localStorage.setItem(this.accessibilityKey, JSON.stringify(a));
    this.applyAccessibility(a);
  }

  private loadTheme(): ThemeSettings {
    try {
      const raw = localStorage.getItem(this.themeKey);
      if (raw) return JSON.parse(raw) as ThemeSettings;
    } catch (e) {}
    return { mode: 'bright', primaryColor: '#3b82f6' };
  }

  private loadAccessibility(): AccessibilitySettings {
    try {
      const raw = localStorage.getItem(this.accessibilityKey);
      if (raw) return JSON.parse(raw) as AccessibilitySettings;
    } catch (e) {}
    return { grayscale: false, highContrast: false, protanopiaFilter: false, deuteranopiaFilter: false, tritanopiaFilter: false, screenReader: false };
  }

  private applyTheme(s: ThemeSettings) {
    const el = document.documentElement;
    if (!el) return;
    if (s.mode === 'dark') {
      el.classList.add('theme-dark');
      el.classList.remove('theme-bright');
    } else {
      el.classList.add('theme-bright');
      el.classList.remove('theme-dark');
    }
    if (s.primaryColor) {
      el.style.setProperty('--primary-color', s.primaryColor);
    }
  }

  private applyAccessibility(a: AccessibilitySettings) {
    const body = document.body;
    if (!body) return;
    // Combine simple CSS filters to approximate accessibility options
    const filters: string[] = [];
    if (a.grayscale) filters.push('grayscale(100%)');
    if (a.protanopiaFilter) filters.push('saturate(0.7) hue-rotate(-15deg)');
    if (a.deuteranopiaFilter) filters.push('saturate(0.7) hue-rotate(15deg)');
    if (a.tritanopiaFilter) filters.push('saturate(0.7) hue-rotate(90deg)');
    if (a.highContrast) filters.push('contrast(140%)');
    body.style.filter = filters.join(' ');

    if (a.screenReader) {
      body.setAttribute('data-screenreader', 'true');
    } else {
      body.removeAttribute('data-screenreader');
    }
  }
}
