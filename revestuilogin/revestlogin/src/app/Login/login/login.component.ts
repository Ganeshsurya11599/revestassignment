// login.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any;

  constructor(
    private fb: FormBuilder, 
    private _service: AuthService, 
    private toastr: ToastrService,
    private routes: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    // Form is valid, perform login logic (e.g., API call)
    console.log(this.loginForm.value);

    var result:any = await this._service.login(this.loginForm.value);
    console.log(result,'result');
    if(result && result.status == true){
      this.toastr.success('Login Successfully!...', 'Success');
      localStorage.setItem('userdetails',JSON.stringify(result));
      this.routes.navigate(['/home']);
    }
    else{
      this.toastr.error(result.msg, 'Failure');
    }
  }

}
