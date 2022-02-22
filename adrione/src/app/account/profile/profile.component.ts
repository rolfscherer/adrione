import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Profile } from '../model/profile';
import { AlertService } from '../../shared/alert/alert.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'adri-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  subs = new Subscription();

  form = this.fb.group({
    username: [{ value: null, disabled: true }],
    alias: [null],
    passwordExpDate: [{ value: null, disabled: true }],
    firstname: [null],
    lastname: [null],
    email: [null, [Validators.email, Validators.required]]
  });

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.profileService.getProfile().subscribe((p) => {
        if (p) {
          const datePipe = new DatePipe('en_US');
          const passwordExpDate = datePipe.transform(
            p.passwordExpirationDate,
            'dd.MM.YYYY HH:mm:ss'
          );

          this.form.patchValue(p);
          this.form.controls['passwordExpDate'].patchValue(passwordExpDate);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit(): void {
    this.isSubmitting = true;
    const profile: Profile = this.form.getRawValue();
    this.subs.add(
      this.profileService.updateProfile(profile).subscribe({
        next: (p) => {
          this.form.patchValue(p);
          this.isSubmitting = false;
          this.alertService.success(
            'Update successful',
            'Profile successfully saved.'
          );
        },
        error: () => {
          this.isSubmitting = false;
        }
      })
    );
  }
}
