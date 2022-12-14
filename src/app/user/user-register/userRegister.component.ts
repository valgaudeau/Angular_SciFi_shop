import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import * as alertify from 'alertifyjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userRegister',
  templateUrl: './userRegister.component.html',
  styleUrls: ['./userRegister.component.css']
})
export class UserRegisterComponent implements OnInit {

  registrationForm!: FormGroup;
  submitted = false;
  user : any = { };

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      userName: new FormControl("", [Validators.required, Validators.minLength(5)]),
      email: new FormControl("", [Validators.required, Validators.email]), // we pass an array of validators
      password: new FormControl("", [Validators.required, Validators.minLength(8)])
    })
  }

  // passwordMatchingValidator(fg: FormGroup): Validators
  // {
  //     return fg.get('password').value === fg.get('confirmPassword').value ? { notmatched: false } : { notmatched: true };
  // }

  get userName(){
    return this.registrationForm.get('user');
  }

  onSubmit(){
    // console.log(form);
    this.submitted = true;

    // if the form is invalid, we don't do anything just return
    if(this.registrationForm.invalid){
      alertify.set("notifier", "position", "top-center");
      alertify.error("Error encountered, please enter valid data");
      return;
    }

    console.log(this.registrationForm.value);
    this.user = Object.assign(this.user, this.registrationForm.value);
    // localStorage.setItem('Users', JSON.stringify(this.user));
    this.userService.addUser(this.user);
    // alert("Success");
    alertify.set("notifier", "position", "top-center");
    alertify.success("You have successfully registered!");
    this.registrationForm.reset(); // reset form when its submitted
    this.submitted = false; // if we go into this block of code, the form submission was successful, and we can now set this boolean to false again
    // After successful registration, the user should be automatically logged in. Need to retrieve array of registered user credentials, and create a new item in local storage with key 'token' for the username that was just registered.
    localStorage.setItem('token', JSON.stringify(this.userName));
    this.router.navigate(['/']);
  }

}
