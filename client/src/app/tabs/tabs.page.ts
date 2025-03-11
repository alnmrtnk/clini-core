import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TabsPage implements OnInit {
  isDesktop = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.checkPlatform();
    window.addEventListener('resize', () => {
      this.checkPlatform();
    });
  }

  checkPlatform() {
    this.isDesktop = window.innerWidth > 768;
  }
}
