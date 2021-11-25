import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from './../../_services/authentication.service';
import { first } from 'rxjs/operators';
import { PasswordValidator } from './../../_validators/password.validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
	resetPasswordForm: FormGroup;
	loading = false;
	token: string;
	isDisplayForm: boolean = false;

	constructor( private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService ) { }

  	ngOnInit() {
  		this.token = this.route.snapshot.queryParams['t'] || '';
  		this.validateResetPass();
  	}

  	validateResetPass(){
  		this.authenticationService.validateResetPass(this.token)
	      .pipe(first())
	      .subscribe(
	          data => {
	              	if(data.meta.status){
	              		this.isDisplayForm = true;
   	         			this.initForm();
	              	} else{
	              		this.router.navigate(['login']);
	              	}
	          },
	          error => {
	            this.router.navigate(['login']);
	    });
  	}

  	initForm(){
  		this.resetPasswordForm = new FormGroup({
	  		'password': new FormControl(null,[Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&]{8,}$/)]),
	  		'cpassword': new FormControl(null,[Validators.required])
	  	}, (formGroup: FormGroup) => {
	 		return PasswordValidator.areEqual(formGroup);
		});
  	}

  	onSubmit(){
  		// stop here if form is invalid
	    if (this.resetPasswordForm.invalid) {
	        return;
	    }
    	this.loading = true;
		let password = this.resetPasswordForm.value.password;
		let cpassword = this.resetPasswordForm.value.cpassword;
  		this.authenticationService.resetPass(this.token, password, cpassword)
	      .pipe(first())
	      .subscribe(
	          data => {
	              	if(data.meta.status){
       	         		this.toastr.success(data.meta.message);
	              	}
              		this.router.navigate(['login']);
	          },
	          error => {
	            if (error && error.meta) {
              		this.toastr.error(error.meta.message);
	          	} else {
	              	this.toastr.error("Something went wrong please try again.");
	          	}
	    });

  	}

}
