import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule], // <- add CommonModule too
})
export class RegisterComponent {
  private router: Router = inject(Router);
  private authService = inject(AuthService);

  register() {
    this.authService.login();
    this.router.navigate(['/payment']);
  }
}