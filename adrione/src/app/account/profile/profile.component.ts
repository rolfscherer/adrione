import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'adri-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  subs = new Subscription();

  form = this.fb.group({
    username: [null],
    alias: [null],
    firstname: [null],
    lastname: [null]
  });

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.profileService.getProfile().subscribe((p) => {
        if (p) {
          this.form.patchValue(p);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit(): void {}
}
