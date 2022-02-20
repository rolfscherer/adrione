import { Component } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile';

@Component({
  selector: 'adri-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profile$: Observable<Profile>;

  constructor(profileService: ProfileService) {
    this.profile$ = profileService.getProfile();
  }
}
