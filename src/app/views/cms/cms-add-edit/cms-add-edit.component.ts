import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Cms } from './../../../model/cms';
import { ApiService } from '../../../_services/api.service';
import { CONFIG } from '../../../config/app-config';
import { CmsDetails } from '../../../model/cms-details';
import { Translatable } from '../../../model/translatable';
import { HttpHeaders } from '@angular/common/http';
import { element } from '@angular/core/src/render3/instructions';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { log } from 'util';

@Component({
  selector: 'app-cms-add-edit',
  templateUrl: './cms-add-edit.component.html',
  styleUrls: ['./cms-add-edit.component.scss']
})
export class CmsAddEditComponent implements OnInit {

	@ViewChild('f') form: any;

	private _id: number;
	editMode: boolean = false;
	editCmsId: number;
	model:CmsDetails=new CmsDetails('','',{});
	submitted: boolean = false;

	routeSub: Subscription;
	cmsSub: Subscription;
	cmsSaveSub: Subscription;
	ck_error=[];
	languages=[];
	buttonDisable=true;
	addEditCmsForm: FormGroup;
	config=CONFIGCONSTANTS["CK-Editor-config"];
	loader:any;
  	constructor( private route: ActivatedRoute,
              private apiService:ApiService,
              private router: Router,
							private toastr: ToastrService,
							private spinner:NgxUiLoaderService ) { }

  	ngOnInit() {
			this.loader = CONFIGCONSTANTS.loaderConfig;	
  		this.routeSub = this.route.params
      	.subscribe(params => {
	        this._id = params['id'];
	        this.editMode = params['id'] != null;
	        setTimeout(()=>{  
		      	this.initForm();
			}, 100);  
      	});
  	}

  	initForm(){
			this.spinner.start();
  		if (this.editMode) {
  			this.cmsSub = this.apiService.getRequest(CONFIG.getCmsByIdURL+this._id)
	        	.pipe(first())
	        	.subscribe(
	            	response => {
									this.spinner.stop();
							this.editCmsId=response.data[0].id;
								this.model.slug=response.data[0].slug;
								this.model.status=response.data[0].status || 'Active';
								this.languages=JSON.parse(localStorage.getItem('currentUser')).data.languages;
								this.languages.forEach(element=>{
									this.model.translatable[element.locale]=new Translatable('','','','','');
									this.ck_error[element.locale]=true;
								})
								response.data.translatable.forEach(element => {
									this.model.translatable[element.locale]=element;									
								});
							this.languages.forEach(element=>{
								if(this.model.translatable[element.locale]['description']!='' && this.model.translatable[element.locale]['description']!=null)
								{
									this.buttonDisable=false;
									this.ck_error[element.locale]=false;	
								}
							})
								
	        	},
	        	error => {
							this.spinner.stop();
	          	console.log(error);  
		  	});
  		}

  	}
		getCKData(type,lan_direction)
		{		
			if(lan_direction=='LTR')
			{
				let a=(this.model.translatable[type].description).substring((this.model.translatable[type].description).indexOf("<body>")+6,(this.model.translatable[type].description).indexOf("</body>"));
				this.ck_error[type]=a.length>0?false:true;				
			}
			if(lan_direction=='RTL')
			{
				
				
				let a=(this.model.translatable[type].description).substring((this.model.translatable[type].description).indexOf('<body dir="rtl">')+16,(this.model.translatable[type].description).indexOf("</body>"));
				this.ck_error[type]=a.length>0?false:true;
			}
			
			 let l:boolean=false;
			this.languages.forEach(element=>{
				if(this.ck_error[element.locale]==true)
				{
					l=true;
				}				
			})
			this.buttonDisable=l;
		}
  	onCmsSave(){
  		// stop here if form is invalid
	    if (this.form.invalid) {
				
	      return;
	    }

	    this.submitted = true;
	    		 this.languages.forEach(element=>{
			 if(this.ck_error[element.locale]==true)
			 {
					return;
			 }
		 })
		 this.getHtmlWithOutBodyTag();
  		if(this.editCmsId){
				this.updateCms(this.editCmsId);
  		} 
  	}
  	updateCms(id){
			this.spinner.start();
  		this.cmsSaveSub = this.apiService.putRequest(CONFIG.updateCmsURL+id,{
				status:this.model.status,
				slug:this.model.slug,
				translable:this.model.translatable
			})
        .pipe(first())
	      .subscribe(
	          data => {
	              	if(data.meta.status){
										this.spinner.stop();
	              		this.toastr.success(data.meta.message);
	              		this.router.navigate(['/cms-management/list']);
	              	}
	          },
	          error => {
	            var errorData=error;
				if (errorData && errorData.meta) {
				if (errorData.meta.message_code == 'VALIDATION_ERROR') {
					this.spinner.stop();
				  if(errorData.errors.page_title){
				    this.toastr.error(errorData.errors.page_title[0]);
				  }
				}else{
				    this.toastr.error(errorData.meta.message);
				}
				}else {
					this.spinner.stop();
					this.router.navigate(['/cms-management/list']);
					this.toastr.error("Something went wrong please try again.");
				}
				this.submitted = false;
	    });
  	}

  	ngOnDestroy() {
    	this.routeSub.unsubscribe();
    	if (this.editMode) {
    		this.cmsSub.unsubscribe();
    	}
		}
		getHtmlWithOutBodyTag()
		{
			var model2=this.model.translatable;
			for(let key in this.model.translatable)
			{
				if(this.model.translatable[key]['description'].indexOf('<body')!=-1 && this.model.translatable[key]['description'].indexOf('</body>')!=-1)
				{
					let text=this.model.translatable[key]['description'].substr(this.model.translatable[key]['description'].indexOf('<body')+5);
					let	text2=text.substr(text.indexOf(">")+1);
					let	text3=text2.substr(0,text2.indexOf('</body>'));
					this.model.translatable[key]['description']=text3;
				}
			}
		}
}
