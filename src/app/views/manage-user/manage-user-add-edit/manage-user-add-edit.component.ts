import { Component, OnInit, ViewChild, ElementRef, NgModule, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ManageuserService } from './../../../_services/manageuser-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { UserDetails } from '../../../model/user-details';
import { ApiService } from '../../../_services/api.service';
import { CONFIG } from '../../../config/app-config';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BsModalService} from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CONFIGCONSTANTS } from '../../../config/app-constants';

@Component({
  selector: 'app-manage-user-add-edit',
  // host: {
  //   '(document:click)': 'onClick($event)',
  // },
  templateUrl: './manage-user-add-edit.component.html',
  styleUrls: ['./manage-user-add-edit.component.scss']
})
export class ManageUserAddEditComponent implements OnInit {
  modalRef: BsModalRef;
  model:UserDetails=new UserDetails('','','',0,'','','','','',
  0,'','',0,'',0,'',0,'','',0,0,'',null,'','','','','','',null,'','','','',[]);
  url: string = 'assets/default-user-image.png';
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  gender: string;
  profile_image: string;
  phone_number: number;
  date_of_birth: string;
  noPicture: boolean;
  maxDate: any;
  countries:any[]=[];
  services:any[]=[];
  size:any[]=[];
  dropdownSetting;
  model_title:string;
  max_year=moment().format('YYYY');
  ma=new Date();
  generalInfo:any;
  contactDetails:any;
  legalInfo:any;
  additionalInfo:any;
  year_arr=[];
  @ViewChild('f') form: any;

  private _id: number;
  editMode: boolean = false;
  editUserId: number;
  submitted: boolean = false;
  routeSub: Subscription;
  userData: Subscription;
  userDataSave: Subscription;
  model_type;
  model_production_name='';
  model_production_company='';
  model_production_credit_uuid='';
  model_pro_year='';
  model_index=0;
  data:any[]=[]
  regi_date_error=true;
  loader;
  date_formate=CONFIGCONSTANTS["date-formate"];
  // model: any = [];

  constructor(private route: ActivatedRoute,
    private apiService:ApiService,
    private modalService: BsModalService,
    private manageuserservice: ManageuserService,
    private router: Router,
    private toastr: ToastrService, private _eref: ElementRef, private ngbDateParserFormatter: NgbDateParserFormatter, private cookieService: CookieService,private spinner:NgxUiLoaderService) {
      /* Set Maximum Date */
      this.maxDate = new Date();
      this.maxDate = {
        year: this.maxDate.getFullYear(),
        month: this.maxDate.getMonth() + 1,
        day: this.maxDate.getDate()
      };
      // this.model.date_of_birth = moment();
    }
	openModal(template: TemplateRef<any>,model_type,index) {
      this.modalRef = this.modalService.show(template, { class: 'modal-md' });
      this.model_type=model_type;
      this.model_title=model_type=='add'?'Add Credit':model_type=='edit'?'Edit Credit':'';
      if(this.model_type=='add')
      {
        this.model_pro_year='';
        this.model_production_company='';
        this.model_production_name='';
      }
      if(this.model_type=='edit')
      {
        this.model_index=index;
        this.model_pro_year=this.data[index].year;
        this.model_production_credit_uuid=this.data[index].uuid;
        this.model_production_company=this.data[index].production_company;
        this.model_production_name=this.data[index].production_name;
      }
    }
    decline(): void {
      this.modalRef.hide();
      this.model_index=null;
      this.model_pro_year='';
      this.model_production_company='';
      this.model_production_name='';
    }
    
    ngOnInit() {
      var start_year=parseInt(moment(new Date()).format('YYYY'));
      var end_year=CONFIGCONSTANTS.minYearForYearSelect;
      for(var i=start_year;i>=end_year;i--)
      {
        this.year_arr.push(i);
      }
      this.loader = CONFIGCONSTANTS.loaderConfig;
      this.dropdownSetting = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit:2,
        allowSearchFilter: true
      };
      var current_route=(this.router.url).split('/');      
      this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this.editMode=current_route[2]=='edit'?true:false;
        this.getServices();
        this.getCountries();
        this.getSize(); 
        setTimeout(() => {
          this.initForm();
        }, 1000);
      });
    
    }
  /* Change and Upload Image in User Module */
    changeImage(event:any) {
	  let img = event;
	  if (event.target.files[0] != undefined) {
	    var imgSize = 2;
	    var temp;
	    var fileTypes = ["image/jpeg", "image/jpg", "image/png"];
	    if ($.inArray(event.target.files[0].type, fileTypes) == -1) {
	      this.toastr.error('Please upload a valid image.');
	    } else {
	      if (((temp = imgSize) === (void 0) || temp === '') || (event.target.files[0].size / 1024) / 1024 < imgSize) {
	        var reader = new FileReader();
	        reader.onload = (event:any) => {
	            this.noPicture = true;
	            this.url = event.target.result;
	            this.model['company_logo']=img.target.files[0];
	            this.uploadCompanyLogo();
	        }
	        reader.readAsDataURL(event.target.files[0]);
	      } else {
	            this.toastr.error("File Size should be smaller than " + imgSize + "MB");
	      }
	    }
	  } else {
	        this.url = 'assets/default-user-image.png';
	  }
	  this.noPicture = false;
	}

    /* Remove Image in User Module */
    removePicture() {
      
      if(!this.cookieService.get('get_id') == undefined) {
        this.manageuserservice.deleteUserProfile(this.cookieService.get('get_id'))
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.url = 'assets/default-user-image.png';
              this.profile_image = 'assets/default-user-image.png';
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.toastr.error(statusError.meta.message);
            } else {
              this.toastr.error("Something went wrong please try again.");
            }
          });
      } else {
          this.noPicture = false;
          this.url = 'assets/default-user-image.png';
          this.profile_image = 'assets/default-user-image.png';
      }
    };

    initForm() {
      this.spinner.start();
      
          this.apiService.getRequest(CONFIG.getEmployeerById+this._id)
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spinner.stop();
                  this.model=data.data;
                  this.model.registration_dt=moment(this.model.registration_dt).format(this.date_formate);
                  this.model.company_logo=(this.model.company_logo=="" || this.model.company_logo==null)?'':
                  data.data.s3_url+'company/'+this.model.company_uuid+'/'+this.model.company_logo;
                  this.url=(this.model.company_logo==""||this.model.company_logo==null)?'assets/default-user-image.png':this.model.company_logo;
                  this.model.registration_dt=this.model.registration_dt;
                  this.model.services=[];
                  var a=data.data.company_services;
                  this.model.registration_dt=this.model.registration_dt!='' && this.model.registration_dt!=null ?new Date(this.model.registration_dt):'';
                  if(this.model.profile_image!="" && this.model.profile_image!=null)
                  {
                    this.model.profile_image=(data.data.s3_url+'user/'+data.data.user_uuid+'/round_'+this.model.profile_image);
                  }
                  if(this.model.registration_dt!='' && this.model.registration_dt!=null)
                  {
                    this.regi_date_error=false;
                  }
                  a.forEach(element =>{
                    var arr=JSON.parse(JSON.stringify(this.services));
                    arr.forEach(ele=>{
                       if(element.service_id==ele.id)
                       {
                       this.model.services.push({
                         id:ele.id,
                         name:ele.name
                       });
                       }
                     })
                  });
                  this.getCompanyCreditList();

                  if(this.model.company_logo!="" && this.model.company_logo!=null)
                  {
                    this.model.company_logo=(data.data.s3_url+'company/'+data.data.company_uuid+'/round_'+this.model.company_logo);
                  }
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  this.toastr.error("Something went wrong please try again.");
                }
              });
        
      }

      onUserDataSave(frm: NgForm) {

        if(!frm.valid)
        {
          console.log('invalid form')
          return;
        }        
        if(this.model.user_type=='Company')
        {
          if(this.model.registration_dt=='Invalid Date')
        {
          return;
        }
        var services_obj=JSON.parse(JSON.stringify(this.model.services));
        var selected_services=[];
        services_obj.forEach(element => {
          selected_services.push(element.id);
        });        
        
        this.generalInfo={
          company_name:this.model.company_name,
          founded_year:this.model.founded_year,
          services:selected_services,
          size:this.model.size,
          position:this.model.position,
          company_uuid:this.model.company_uuid
        }

        this.contactDetails={
          company_uuid:this.model.company_uuid,
          company_address:this.model.company_address,
          country_id:this.model.company_country_id,
          city:this.model.company_city,
          post_code:this.model.company_post_code,
          contact_no_prefix:this.model.contact_no_prefix,
          contact_no:this.model.contact_no,
          is_contact_no_public:this.model.is_contact_no_public
        }
        this.legalInfo={
          company_uuid:this.model.company_uuid,
          registration_no:this.model.registration_no,
          registration_dt:moment(this.getFormatedDate(this.model.registration_dt)).format('YYYY-MM-DD')
        }
        
        this.additionalInfo={
          company_uuid:this.model.company_uuid,
          overview:this.model.overview,
          website_link:this.model.website_link,
          facebook_link:this.model.facebook_link,
          twtter_link:this.model.twtter_link,
          linkedin_link:this.model.linkedin_link
        }        
        this.spinner.start();
        this.updateGeneralInfo(this.generalInfo);
        }
        else
        {
          this.updateUserInfo();
        }
        
    }

    createManageUser(formData) {
      this.spinner.start();
      this.userDataSave = this.manageuserservice.createManageUser(formData)
      .pipe(first())
      .subscribe(
        data => {
          this.spinner.stop();
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/manage-employers/list']);
          }
        },
        error => {
          var errorData = error;
          if (errorData && errorData.meta) {
            if (errorData.meta.message_code == 'VALIDATION_ERROR') {
              if (errorData.errors.page_title) {
                this.toastr.error(errorData.errors.page_title[0]);
                this.spinner.stop();
              }
              if (errorData.errors.email) {
                this.toastr.error(errorData.errors.email);
                this.spinner.stop();
              }
              if (errorData.errors.username) {
                this.toastr.error(errorData.errors.username);
                this.spinner.stop();
              }
            } else {
              this.toastr.error(errorData.meta.message);
              this.spinner.stop();
            }
          } else {
            this.spinner.stop();
            this.router.navigate(['/manage-employers/list']);
            this.toastr.error("Something went wrong please try again.");
            this.toastr.error(errorData.meta.message);
          }
          this.submitted = false;
          this.spinner.stop();
        });
      }

      updateManageUser(formData, id) {
        this.spinner.start();
        this.userDataSave = this.manageuserservice.updateManageUser(formData, id)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status) {
              this.toastr.success(data.meta.message);
              this.router.navigate(['/manage-employers/list']);
              this.spinner.stop();
            }
          },
          error => {
            var errorData = error;
            if (errorData && errorData.meta) {
              if (errorData.meta.message_code == 'VALIDATION_ERROR') {
                if (errorData.errors.page_title) {
                  this.toastr.error(errorData.errors.page_title[0]);
                  this.spinner.stop();
                }
                if (errorData.errors.email) {
                  this.toastr.error(errorData.errors.email);
                  this.spinner.stop();
                }
                if (errorData.errors.username) {
                  this.toastr.error(errorData.errors.username);
                  this.spinner.stop();
                }
              } else {
                this.toastr.error(errorData.meta.message);
                this.spinner.stop();
              }
            } else {
              this.router.navigate(['/manage-employers/list']);
              this.toastr.error("Something went wrong please try again.");
              this.spinner.stop();
            }
            this.submitted = false;
            this.spinner.stop();
          });
        }

        ngOnDestroy() {
         
        
        }
        getCountries() {
          this.countries=[];
          this.apiService.getRequest(CONFIG.getCountriesListURL)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spinner.stop();
                  this.countries=data.data.data;                      
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  this.toastr.error("Something went wrong please try again.");
                }
              });
        }

        getServices() {
          this.apiService.getRequest(CONFIG.getSericesListURL)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spinner.stop();    
                  this.services=this.sorrArray(data.data,"name");         
                         
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  // this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  // this.toastr.error("Something went wrong please try again.");
                }
              });
        }

        getSize() {
          this.apiService.getRequest(CONFIG.getSizeListURL)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spinner.stop();    
                  this.size=data.data;                  
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  this.toastr.error("Something went wrong please try again.");
                }
              });
        }

        getCompanyCreditList() {
          this.apiService.getRequest(CONFIG.CompanyCreditListURL+this.model.company_uuid)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spinner.stop();    
                  this.data=data.data;               
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  this.toastr.error("Something went wrong please try again.");
                }
              });
        }

        deleteCompanyCredit() {
          this.apiService.getRequest(CONFIG.CompanyCreditListURL+this.model.company_uuid)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spinner.stop();    
                  this.data=data.data;               
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  this.toastr.error("Something went wrong please try again.");
                }
              });
        }


        openImageUpload(){
          $("#Clogo").click();
      }

      getFormatedDate(date){
        if(date){
          let month=date.getMonth()+1;
          let day=date.getDate();
          if(month<10){
            month=`0${month}`;
          }
          if(day<10){
            day=`0${day}`;
          }
          return `${date.getFullYear()}-${month}-${day}`;
        }else{
          return '';
        }
      }
      buttonClick(frm:NgForm)
      {
        if(!frm.valid)
        {
          return;
        }
        if(this.model_type=='add')
        {
          this.addProduct(frm);
        }
        if(this.model_type=='edit')
        {
          this.editProduct(frm);
        }
      }
      addProduct(frm:NgForm)
      {
        if(!frm.valid)
        {
          return;
        }
        this.apiService.postRequest(CONFIG.addCompanyCreditURL,{
          company_uuid:this.model.company_uuid,
          production_name:this.model_production_name,
          production_company:this.model_production_company,
          year:this.model_pro_year  
        })
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.getCompanyCreditList();
              this.spinner.stop();    
              this.toastr.success(data.meta.message);
                }
              },
              error => {
                let statusError = error;
                if (statusError && statusError.meta) {
                  this.spinner.stop();
                  this.toastr.error(statusError.meta.message);
                } else {
                  this.spinner.stop();
                  this.toastr.error("Something went wrong please try again.");
                }
              });
        this.decline();
      }
      
      editProduct(frm:NgForm)
      {
        if(!frm.valid)
        {
          return;
        }
        this.apiService.postRequest(CONFIG.updateCompanyCreditURL,{
          company_credit_uuid:this.model_production_credit_uuid,
          company_uuid:this.model.company_uuid,
          production_name:this.model_production_name,
          production_company:this.model_production_company,
          year:this.model_pro_year  
        })
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.getCompanyCreditList();
              this.spinner.stop();    
              this.toastr.success(data.meta.message);
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
        this.decline();
      }

      removeProduct(uuid)
      {
        this.apiService.deleteRequest(CONFIG.deleteCompanyCreditURL+uuid,{})
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.spinner.stop();    
              this.toastr.success(data.meta.message);
              this.getCompanyCreditList();
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
        this.decline();  
      }
      updateGeneralInfo(data)
      {
        this.apiService.postRequest(CONFIG.updateGeneralInfoURL,data)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              // this.toastr.success(data.meta.message)
              var that=this;
              setTimeout(function(){
                that.updateContactInfo(that.contactDetails);
              },1000);
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
      }

      updateContactInfo(data)
      {
        this.apiService.postRequest(CONFIG.updateContactInfoURL,data)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              // this.toastr.success(data.meta.message)
              var that=this;
              setTimeout(function(){
                that.updateLegalInfo(that.legalInfo);
              },1000);
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
      }
      updateLegalInfo(data)
      {
        this.apiService.postRequest(CONFIG.updateLegalInfoURL,data)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              var that=this;
              setTimeout(function(){
                that.updateAdditionalInfo(that.additionalInfo);
              },1000);
              // this.toastr.success(data.meta.message)
              // this.updateAdditionalInfo(this.additionalInfo);
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
      }
      updateAdditionalInfo(data)
      {
        this.apiService.postRequest(CONFIG.updateAdditionalInfoURL,data)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.spinner.stop();
              this.updateUserInfo();
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
        }
        uploadCompanyLogo()
        {
          this.apiService.postRequest(CONFIG.uploadCompanyLogo,{
            file:this.model.company_logo
          })
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.toastr.success(data.meta.message);
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
        }
        removeCompanyLogo()
        {
          this.apiService.postRequest(CONFIG.removeCompanyLogo,{
            uuid:this.model.company_uuid
          })
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.toastr.success(data.meta.message);
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {
              this.spinner.stop();
              this.toastr.error(statusError.meta.message);
            } else {
              this.spinner.stop();
              this.toastr.error("Something went wrong please try again.");
            }
          });
        }

        updateUserInfo()
        {
          this.apiService.postRequest(CONFIG.updateUserDetails+this.model.employer_uuid,{
            email:this.model.email,
            first_name:this.model.first_name,
            last_name:this.model.last_name,
            country:this.model.user_country_id,
            city:this.model.user_city,
            postcode:this.model.post_code
         })
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                this.spinner.stop();
                this.toastr.success("Data updated Successfully");
                this.router.navigate(['/manage-employers/list']);
              }
            },
            error => {
              let statusError = error;
              if (statusError && statusError.meta) {
                this.spinner.stop();
                this.toastr.error(statusError.meta.message);
              } else {
                this.spinner.stop();
                this.toastr.error("Something went wrong please try again.");
              }
            });
          }
          sorrArray(array,key)
          {
                     
            return array.sort(function(a,b){
              if ((a[key] as string).toLowerCase() < (b[key] as string).toLowerCase())
                return -1;
              if ((a[key] as string).toLowerCase() > (b[key] as string).toLowerCase())
                return 1;
              return 0;
            }); 
          }
          navigateToEditPage()
          {
            this.router.navigateByUrl('/manage-employers/edit/'+this._id);
          }
      }
