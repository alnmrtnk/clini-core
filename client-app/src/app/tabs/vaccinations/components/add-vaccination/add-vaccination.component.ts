import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vaccination',
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-vaccination.component.html',
  styleUrls: ['./add-vaccination.component.scss'],
})
export class AddVaccinationComponent {
  vaccinationForm: FormGroup;
  today: string = new Date().toISOString();
  tomorrow: string = new Date(Date.now() + 86400000).toISOString();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.vaccinationForm = this.formBuilder.group({
      vaccineName: ['', Validators.required],
      otherVaccineName: [''],
      doseNumber: ['1', Validators.required],
      dateAdministered: [this.today, Validators.required],
      administeredBy: [''],
      location: [''],
      lotNumber: [''],
      notes: [''],
      sideEffects: [''],
      setReminder: [false],
      nextDoseDate: [this.tomorrow],
    });

    this.vaccinationForm.get('vaccineName')?.valueChanges.subscribe((value) => {
      const otherVaccineControl = this.vaccinationForm.get('otherVaccineName');
      if (value === 'other') {
        otherVaccineControl?.setValidators([Validators.required]);
      } else {
        otherVaccineControl?.clearValidators();
      }
      otherVaccineControl?.updateValueAndValidity();
    });
  }

  saveVaccination() {
    if (this.vaccinationForm.valid) {
      console.log('Saving vaccination:', this.vaccinationForm.value);
      // Here you would typically call a service to save the data
      // For now, we'll just navigate back
      this.router.navigate(['/tabs/vaccinations']);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.vaccinationForm.controls).forEach((key) => {
        this.vaccinationForm.get(key)?.markAsTouched();
      });
    }
  }

  cancel() {
    this.router.navigate(['/tabs/vaccinations']);
  }
}
