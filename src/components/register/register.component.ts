import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  // FIX: Explicitly type injected Router to resolve 'unknown' type error.
  private router: Router = inject(Router);
  private authService = inject(AuthService);

  register() {
    // Mock registration logic
    this.authService.login();
    this.router.navigate(['/payment']);
  }
}
