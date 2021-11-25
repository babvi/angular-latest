import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailService } from './../../../_services/email-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Email } from './../../../model/email';
import { ApiService } from '../../../_services/api.service';
import { CONFIG } from '../../../config/app-config';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-email-add-edit',
  templateUrl: './email-add-edit.component.html',
  styleUrls: ['./email-add-edit.component.scss']
})
export class EmailAddEditComponent implements OnInit {

  @ViewChild('f') form: any;

  private _id: number;
  editMode: boolean = false;
  editCmsId: number;
  model={};
  submitted: boolean = false;
  email_subject: string;
  email_body: string;
  routeSub: Subscription;
  emailSub: Subscription;
  emailSaveSub: Subscription;
	ck_error=[];
  addEditCmsForm: FormGroup;
  languages=[];
  status;
  ck_config=CONFIGCONSTANTS["CK-Editor-config"];
  loader:any;
  constructor(private route: ActivatedRoute,
    private spinner:NgxUiLoaderService,
    private apiService:ApiService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this.editMode = params['id'] != null;
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.initForm();
        }, 100);
      });
  }

  initForm() {
    this.spinner.start();
    if (this.editMode) {
      this.emailSub = this.apiService.getRequest(CONFIG.getEmailByIdURL + this._id)
        .pipe(first())
        .subscribe(
          response => {
            this.spinner.stop();
            this.languages=JSON.parse(localStorage.getItem('currentUser')).data.languages;
            this.languages.forEach(element=>{
              this.model[element.locale]=new Email('','');
            })
            this.editCmsId = response.data[0].id || null;
            this.status = response.data[0].status || null;
            response['data'].forEach(element => {
              this.model[element.locale]=element;
              this.ck_error[element.locale]=true;
            });
            this.languages.forEach(element=>{
              // if(this.model[element.locale]['email_body']!='' && this.model[element.locale]['email_body']!=null)
              // {
              //   // this.buttonDisable=false;
              //   this.ck_error[element.locale]=false;	
              // }
              this.getCKData(element.locale,element.text_direction)
            })
          },
          error => {
            this.spinner.stop();
            console.log(error);
          });
    }

  }

  onEmailSave() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    let c_error=false;
    this.languages.forEach(element=>{
      if(this.ck_error[element.locale]==true)
      {
        c_error=true;  
      }
    })
    if(c_error)
    {
      return;
    }
    if (this.editCmsId) {
      this.updateEmail({
        status:(this.status as string).toLowerCase(),
        translable:this.model
      }, this.editCmsId);
    }
  }

  updateEmail(formData, id) {
    this.spinner.start();
    delete formData.translable.status;
    this.emailSaveSub = this.apiService.putRequest(CONFIG.updateEmailURL + id, formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.spinner.stop();
            this.toastr.success(data.meta.message);
            this.router.navigate(['/email-template/list']);
          }
        },
        error => {
          this.spinner.stop();
          var errorData = error;
          if (errorData && errorData.meta) {
            if (errorData.meta.message_code == 'VALIDATION_ERROR') {
              if (errorData.errors.page_title) {
                this.toastr.error(errorData.errors.page_title[0]);
              }
            } else {
              this.toastr.error(errorData.meta.message);
            }
          } else {
            this.router.navigate(['/email-template/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    if (this.editMode) {
      this.emailSub.unsubscribe();
    }
  }
	getCKData(type,lan_direction)
		{
     if(this.model[type].email_body==undefined || this.model[type].email_body==null)
      {        
        this.ck_error[type]=true;
        return;
      }
      if(this.model[type].email_body.length==0 )
      {
        this.ck_error[type]=true;
        return;
      }
			if(lan_direction=='LTR')
			{
      
				let a=(this.model[type].email_body).substring((this.model[type].email_body).indexOf("<body>")+6,(this.model[type].email_body).indexOf("</body>"));
			
        this.ck_error[type]=a.length>0?false:true;
    
        				
			}
			if(lan_direction=='RTL')
			{
       	let a=(this.model[type].email_body).substring((this.model[type].email_body).indexOf('<body dir="rtl">')+16,(this.model[type].email_body).indexOf("</body>"));
         this.ck_error[type]=a.length>0?false:true;
			
			}
		
			 let l:boolean=false;
			this.languages.forEach(element=>{
				if(this.ck_error[element.locale]==true)
				{
					l=true;
				}				
			})
		}
}
