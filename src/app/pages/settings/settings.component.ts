import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, ThemeSettings, AccessibilitySettings } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  theme: ThemeSettings = { mode: 'bright', primaryColor: '#3b82f6' };
  accessibility: AccessibilitySettings = { grayscale: false, highContrast: false, protanopiaFilter: false, deuteranopiaFilter: false, tritanopiaFilter: false, screenReader: false };

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    this.theme = this.settings.theme$.value;
    this.accessibility = this.settings.accessibility$.value;
  }

  saveTheme() {
    this.settings.setTheme(this.theme);
  }

  saveAccessibility() {
    this.settings.setAccessibility(this.accessibility);
  }

  resetAccessibility() {
    this.accessibility = { grayscale: false, highContrast: false, protanopiaFilter: false, deuteranopiaFilter: false, tritanopiaFilter: false, screenReader: false };
    this.saveAccessibility();
  }
}
