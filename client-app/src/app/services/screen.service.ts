import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private isDesktopSubject = new BehaviorSubject<boolean>(false);
  isDesktop$ = this.isDesktopSubject.asObservable();

  checkScreenSize() {
    const isDesktop = window.innerWidth >= 992;
    this.isDesktopSubject.next(isDesktop);
  }
}
