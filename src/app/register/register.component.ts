import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { DataRepositoryService } from '../_services/data-repository.service';
import { UserRegister } from '../_models/user-register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  passForm: FormGroup;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
    private myRoute: Router,
    private auth: AuthService,
    private data: DataRepositoryService) {
      this.userForm = fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      });
      this.passForm = fb.group({
        password: ['', Validators.required],
        confPassword: ['', Validators.required]
      }, {validator: this.checkPasswords});
  }

  private checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let conf = group.controls.confPassword.value;

    let same: boolean = pass === conf;

    if (same) {
      return null;
    } else {
      group.controls.confPassword.setErrors({
        notSame: true
      });

      return {
        notSame: true
      };
    }
  }

  get u() { return this.userForm.controls; }
  get p() { return this.passForm.controls; }

  ngOnInit() {
  }

  onRegisterClick() {
    this.submitted = true;

    console.log(this.userForm.valid);
    console.log(this.passForm.valid);

    if (this.userForm.valid && this.passForm.valid) {
      let user: UserRegister = new UserRegister();

      user.firstName = this.userForm.controls.firstName.value;
      user.lastName = this.userForm.controls.lastName.value;
      user.email = this.userForm.controls.email.value;
      user.password = this.passForm.controls.password.value;

      this.data.registerUser(user).subscribe((registered) => {
        console.log("Did it register? " + registered);
      })
    }
  }

  onCancelClick() {
    this.myRoute.navigate(['/login']);
  }
}
