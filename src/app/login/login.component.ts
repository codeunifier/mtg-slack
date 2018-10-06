import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { DataRepositoryService } from '../_services/data-repository.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  invalid_credentials: boolean = false;

  constructor(private fb: FormBuilder,
    private myRoute: Router,
    private auth: AuthService,
    private data: DataRepositoryService) {
    this.myForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.myForm.controls; }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
  }

  onLoginClick() {
    if (this.myForm.valid) {
      let email: string = this.myForm.controls.email.value;
      let password: string = this.myForm.controls.password.value;

      this.data.validateLogin(email, password).subscribe((data) => {
        if (data) {
          if (data.valid) {
            this.auth.sendToken(data.token);
            this.myRoute.navigate(['/']);
          } else {
            this.invalid_credentials = true;
          }
        }
      });
    }
  }

  onRegisterClick() {
    this.myRoute.navigate(['/register']);
  }
}
