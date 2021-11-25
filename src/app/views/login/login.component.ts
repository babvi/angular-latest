import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenticationService } from './../../_services/authentication.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  loginForm: FormGroup;
	forgotPassWordForm: FormGroup;
	returnUrl: string;
  loading = false;
  forgotPassLoading = false;

  constructor( private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private spinner:NgxUiLoaderService) { }

	ngOnInit() {

    //login form
		this.loginForm = new FormGroup({
  		'email': new FormControl(null,[Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
  		'password': new FormControl(null,[Validators.required, Validators.minLength(8)])
  	});

    //forgot password form
    this.forgotPassWordForm = new FormGroup({
      'forgotPassemail': new FormControl(null,[Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
    });

  	// reset login status
    this.authenticationService.logout();
 
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

	}

	onSubmit(){
    this.spinner.start();
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    this.loading = true;
		let email = this.loginForm.value.email;
		let password = this.loginForm.value.password;
		this.authenticationService.login(email, password)
      .pipe(first())
      .subscribe(
          data => {
              if(data.meta.status){
                this.spinner.stop();
              	this.authenticationService.setLoggedIn(true);
                this.toastr.success(data.meta.message);
              	this.router.navigate([this.returnUrl]);
              }
          },
          error => {
            let responseData = error;
            if (responseData.meta) {
                this.toastr.error(responseData.meta.message);
            } else {
                this.toastr.error("Something went wrong please try again.");
            }
            this.spinner.stop();
            this.loading = false;
    });
	}

	ngAfterViewInit(){
		//Remove fixed sidebar and header classes from body
		document.querySelector('body').classList.remove('sidebar-fixed', 'aside-menu-fixed', 'sidebar-lg-show', 'header-fixed');
	}

  forgotPassword(){
    this.spinner.start();
    // stop here if form is invalid
    if (this.forgotPassWordForm.invalid) {
        return;
    }
    this.forgotPassLoading = true;
    let forgotPassemail = this.forgotPassWordForm.value.forgotPassemail;
    this.authenticationService.forgotPassword(forgotPassemail)
      .pipe(first())
      .subscribe(
          data => {
              if(data.meta.status){
                this.spinner.stop();
                this.forgotPassWordForm.reset();
                this.myModal.hide();
                this.forgotPassLoading = false;
                this.toastr.success(data.meta.message);
              }
          },
          error => {
            if (error && error.meta) {
              this.toastr.error(error.meta.message);
            } else {
                this.toastr.error("Something went wrong please try again.");
            }
            this.spinner.stop();
            this.forgotPassLoading = false;
    });
  }
}
