import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { Store } from '@ngxs/store';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoadRecords } from 'src/app/store/medical-record.state';
import { LoadVaccinations } from 'src/app/store/vaccination.state';
import { GetAllOrders, FindPatient } from 'src/app/store/esculab.state';
import { MedicalRecord } from 'src/app/models/medical-record.model';
import { Vaccination } from 'src/app/models/vaccination.model';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let storeSpy: jasmine.SpyObj<Store>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    authSpy = jasmine.createSpyObj('AuthService', ['currentUserId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    storeSpy.select.and.callFake((selector: any) => {
      if (selector === jasmine.anything()) {
        return of([]);
      }
    });

    await TestBed.configureTestingModule({
      declarations: [DashboardPage],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('should dispatch all load actions on init when userId exists', () => {
    authSpy.currentUserId.and.returnValue('user123');
    component.ngOnInit();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      new LoadVaccinations('user123')
    );
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new LoadRecords());
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new GetAllOrders());
    expect(storeSpy.dispatch).toHaveBeenCalledWith(new FindPatient());
  });

  it('should not dispatch any actions if no userId is provided', () => {
    authSpy.currentUserId.and.returnValue(null);
    component.ngOnInit();
    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it('should correctly compute recentRecords sorted by date descending', () => {
    const records: MedicalRecord[] = [
      {
        id: '1',
        userId: 'u',
        recordTypeName: 't',
        title: '',
        date: '2025-01-01',
        notes: '',
        files: [],
      },
      {
        id: '2',
        userId: 'u',
        recordTypeName: 't',
        title: '',
        date: '2025-05-01',
        files: [],
      },
      {
        id: '3',
        userId: 'u',
        recordTypeName: 't',
        title: '',
        date: '2025-03-01',
        files: [],
      },
    ];
    storeSpy.select.and.returnValue(of(records));
    fixture.detectChanges();

    const recent = component.recentRecords();
    expect(recent[0].id).toBe('2');
    expect(recent.length).toBe(3);
  });

  it('should correctly filter upcomingVaccinations with dueDate in the future', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const future = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const vaccinations: Vaccination[] = [
      {
        id: 'v1',
        userId: 'u',
        dateAdministered: past.toISOString(),
        vaccineName: '',
        doseNumber: 0,
      },
      {
        id: 'v2',
        userId: 'u',
        dateAdministered: now.toISOString(),
        vaccineName: '',
        doseNumber: 0,
      },
      {
        id: 'v3',
        userId: 'u',
        dateAdministered: future.toISOString(),
        vaccineName: '',
        doseNumber: 0,
      },
    ];
    storeSpy.select.and.returnValue(of(vaccinations));
    fixture.detectChanges();

    const upcoming = component.upcomingVaccinations();
    expect(upcoming.some((v) => v.id === 'v3')).toBeTrue();
    expect(upcoming.every((v) => v.dueDate > now)).toBeTrue();
  });

  it('should call router.navigate with the correct path', () => {
    component.navigate('/test-path');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/test-path']);
  });
});
