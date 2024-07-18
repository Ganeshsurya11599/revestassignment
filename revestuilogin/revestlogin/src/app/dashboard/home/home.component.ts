import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  hide = true;
  admin:any={
    username:'',
    emailid:'',
    password:''
  }
  loginForm: any;

  ELEMENT_DATA: any = [
    { position: 1, name: 'John Doe', active: true },
    { position: 2, name: 'Jane Smith', active: false },
    { position: 3, name: 'Bob Johnson', active: true },
    { position: 4, name: 'Alice Brown', active: false },
  ];
  userdetails: any;

  constructor( 
    private service:AuthService,
    private router:Router,
    private fb: FormBuilder,
    private toastr:ToastrService
   ) { 
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
   }

   get f() { return this.loginForm.controls; }

   displayedColumns: string[] = ['user_id', 'username', 'email', 'role', 'active'];
  dataSource:any;

  async toggleActive(element: any) {
    console.log('Toggle change:', element);
    let result:any = await this.service.updateUserActiveStatus({isactive:element.is_active});
    if(result && result.status == true){
      this.toastr.success(result.msg, 'Success');
      this.getUsers();
    }
    else{
      this.toastr.error(result.msg, 'Failure');
    }
  }

  async ngOnInit() {
    this.userdetails = this.service.getUserDetails();
    this.getUsers();
  }

  async getUsers(){
    var data:any = await this.service.allUsers({});
    if(data.status){
      this.dataSource = new MatTableDataSource<any>(data.data)
    }
    else{
      this.dataSource = new MatTableDataSource<any>([])
    }
  }

  async onSubmit(){  
    console.log(this.loginForm.value); 
    let result:any = await this.service.createUser(this.loginForm.value)
    if(result && result.status == true){
      this.toastr.success(result.msg, 'Success');
      this.getUsers();
      this.loginForm.reset();
    }
    else{
      this.toastr.error(result.msg, 'Failure');
    }
  }

  logout(){
    localStorage.removeItem('userdetails');
    this.router.navigate(['/']);
  }
}
