import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router) {}

  redirectToMain() {
    this.router.navigate(['/']).then();
  }

  redirectToLogin() {
    this.router.navigate(['/auth/sign-in']).then();
  }

  redirectToProfile(username: string) {
    this.router.navigate([`/profile/${username}`]).then();
  }
}
