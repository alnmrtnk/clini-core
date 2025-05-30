import { Component, effect, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ScreenService } from '../services/screen.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { AccessState } from '../store/doctor-access.state';

@Component({
  selector: 'app-tabs',
  imports: [IonicModule, CommonModule],
  templateUrl: 'tabs.page.html',
  styleUrl: 'tabs.page.scss',
})
export class TabsPage implements OnInit {
  private readonly store = inject(Store);
  private readonly screenService = inject(ScreenService);
  isDesktop = false;
  public readonly tabs: { label: string; icon: string; id: string }[] = [
    { label: 'Dashboard', icon: 'home-outline', id: 'dashboard' },
    { label: 'Records', icon: 'document-text-outline', id: 'medical-records' },
    { label: 'Doctors', icon: 'people-outline', id: 'doctor-access' },
    { label: 'Settings', icon: 'settings-outline', id: 'settings' },
  ];
  public expanded = false;
  private readonly sharedWithMe = toSignal(
    this.store.select(AccessState.sharedRecords)
  );

  constructor() {
    effect(() => {
      const shared = this.sharedWithMe();
      if (shared?.length && !this.tabs.some((t) => t.id === 'shared-records')) {
        const idx = this.tabs.findIndex((t) => t.id === 'medical-records');
        if (idx !== -1) {
          this.tabs.splice(idx, 0, {
            label: 'Shared',
            icon: 'share-social-outline',
            id: 'shared-records',
          });
        }
      }
    });
  }

  ngOnInit() {
    this.screenService.isDesktop$.subscribe((isDesktop) => {
      this.isDesktop = isDesktop;
    });
  }
}
