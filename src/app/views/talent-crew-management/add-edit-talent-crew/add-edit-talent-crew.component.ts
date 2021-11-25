import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../../config/app-config';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApiService } from '../../../_services/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { element } from '@angular/core/src/render3/instructions';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { log } from 'util';
@Component({
  selector: 'app-add-edit-talent-crew',
  templateUrl: './add-edit-talent-crew.component.html',
  styleUrls: ['./add-edit-talent-crew.component.scss']
})
export class AddEditTalentCrewComponent implements OnInit {
  year_arr=[];
  ethnicityList:any[]=[];
  skillsList:any[]=[];
  productionTypeList:any[]=[];
  expereneInYearList:any[]=[];
  bodyTypeList:any[]=[];
  hairColorList:any[]=[];
  eyeColorList:any[]=[];
  spokenLaguagesList:any[]=[];
  experienceList:any[]=[];
  userTypeList:any[]=[];
  countryList:any[]=[];
  uuid:string;
  dropdownSettings;
  dropdownSettings_single;
  responce_model={};
  data=[
    {
      name:'test',
      company:'test company',
      year:'2012'
    },
    {
      name:'test2',
      company:'test company 2',
      year:'2013'
    }
  ]
  modalRef: BsModalRef;
  model_production_name="";
  model_production_company="";
  model_pro_year="";
  model_your_role="";
  model_update_uuid="";
  model_city="";
  model_production_type="";
  model_country="";
  model_type="";
  model_index="";
  model_user_type;
  model_title="";
  model_user_talent_uuid="";
  model=
  {
    first_name:'',
    last_name:'',
    country_id:'',
    company_name:'',
    title:'',
    city:'',
    email:'',
    ethnicity_id:'',
    eye_color_id:'',
    hair_color_id:'',
    gender:null,
    is_actor:null,
    is_modal:null,
    is_voiceover:null,
    is_crew:null,
    user_type_id:[],
    userType:[],
    is_private:null,
    overview:null
  };
  loader:any;
  model2={
    Actor:{
      user_type:'',
      gender:"",
      min_age:"",
      max_age:"",
      ethnicity_id:"",
      body_type_id:"",
      hair_color_id:"",
      eye_color_id:"",
      height:"",
      weight:"",
      skills:[],
      language:[],
      experienced:[],
      data:[]
    },
    Modal:{
      user_type:"",
      gender:"",
      min_age:"",
      max_age:"",
      ethnicity_id:"",
      body_type_id:"",
      hair_color_id:"",
      eye_color_id:"",
      height:"",
      weight:"",
      skills:[],
      language:[],
      experienced:[],
      waist:"",
      bust:"",
      hips:"",
      build_id:"",
      data:[]
    },
    Voiceover:{
      user_type:'',
      gender:"",
      min_age:"",
      max_age:"",
      ethnicity_id:"",
      body_type_id:"",
      hair_color_id:"",
      eye_color_id:"",
      height:"",
      age:'',
      weight:"",
      skills:[],
      language:[],
      experienced:[],
      data:[]
    },
    Crew:{
      user_type:'',
      gender:"",
      min_age:"",
      max_age:"",
      ethnicity_id:"",
      body_type_id:"",
      hair_color_id:"",
      eye_color_id:"",
      height:"",
      weight:"",
      skills:[],
      language:[],
      experienced:[],
      pay_rate:"",
      experience_years:"",
      data:[]
    }
  }
  
  constructor(private apiService:ApiService, private toastr: ToastrService,
    private modalService: BsModalService,private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    var start_year=parseInt(moment(new Date()).format('YYYY'));
      var end_year=CONFIGCONSTANTS.minYearForYearSelect;
      for(var i=start_year;i>=end_year;i--)
      {
        this.year_arr.push(i);
      }
    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.spinner.start();
    this.model.ethnicity_id='';
    this.route.params
      .subscribe(params => {
        this.uuid = params['id'];
        setTimeout(() => {
          //this.initForm();
          //this.getCountries();
          this.getSpokenLaguagesList();
          this.getUserTypeList();
          this.getCountryList();
          this.getBodyTypeList();
          this.getSkillsList();
          this.getEthnicityList();
          this.getEyeColorList();
          this.getHairColorList();
          this.getProductinTypeList();
          this.getExperienceYearList();
          this.getExperienceList();
          this.getDetails();
          this.spinner.stop();
        }, 100);
        
      });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
  };
  this.dropdownSettings_single = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
};
  }

  //bodyTypeList
    getEthnicityList() {
      this.apiService.getRequest(CONFIG.getEthnicityListURL)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.ethnicityList=data.data;           
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
    }

  //get  Body Type List
    getBodyTypeList() {
      this.apiService.getRequest(CONFIG.getBodyTypeListURL)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.bodyTypeList=data.data;           
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
    }

    //get  Hair Colour List
    getHairColorList() {
      this.apiService.getRequest(CONFIG.getHairColorListURL)
        .pipe(first())
        .subscribe(
          data => {
            if (data.meta.status == true) {
              this.hairColorList=data.data;           
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
    }

      //get  Eye Color List
      getEyeColorList() {
        this.apiService.getRequest(CONFIG.getEyeColorListURL)
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                this.eyeColorList=data.data;           
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
      }

       //get User Type  List
       getUserTypeList() {
        this.apiService.getRequest(CONFIG.getUserTypeListURL)
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                this.userTypeList=data.data;
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
      }

        //get Country  List
        getCountryList() {
          this.apiService.getRequest(CONFIG.getCountriesListURL)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.countryList=data.data.data;                            
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
        }
         //get Spoken Languages List
        getSpokenLaguagesList() {
          this.apiService.getRequest(CONFIG.getSpokenLanguageListURL)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.spokenLaguagesList=data.data;                            
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
        }

          //get Experience List
          getExperienceList() {
            this.apiService.getRequest(CONFIG.getExperienceListURL)
              .pipe(first())
              .subscribe(
                data => {
                  if (data.meta.status == true) {
                      this.experienceList=data.data;                            
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
          }

           //get Skills List
           getSkillsList() {
            this.apiService.getRequest(CONFIG.getSkillsListURL)
              .pipe(first())
              .subscribe(
                data => {
                  if (data.meta.status == true) {
                      this.skillsList=data.data
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
          }

          //get Production Type List
          getExperienceYearList() {
            this.apiService.getRequest(CONFIG.getExperienceInYearList)
              .pipe(first())
              .subscribe(
                data => {
                  if (data.meta.status == true) {
                    this.expereneInYearList=data.data
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
          }
              //get Production Type List
              getProductinTypeList() {
                this.apiService.getRequest(CONFIG.getProductionTypeList)
                  .pipe(first())
                  .subscribe(
                    data => {
                      if (data.meta.status == true) {
                          this.productionTypeList=data.data
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
              }

         //get Country  List
         getDetails() {
          this.apiService.getRequest(CONFIG.getTalentDetailsURL+this.uuid)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.model=data.data;
                  this.model.userType=[];
                  this.model.user_type_id=[];
                  data.data.talentData.forEach(element => {
                    this.model.user_type_id.push(element.user_type);
                    this.userTypeList.forEach(ele=>{
                    if(element.user_type==ele.id)
                      {
                        this.model.userType.push(ele);
                        // var a=JSON.parse(JSON.stringify(element));
                        this.model2[ele.name]=this.getObject(JSON.parse(JSON.stringify(element)));
                        // this.model2[ele.name]['data']=[];
                        this.getCreditList(ele.name,this.model2[ele.name]['uuid']);
                      }
                    })
                  });
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
        }
        submitForm(frm:NgForm)
        {
            if(!frm.valid)
            {
              return;
            }
            var error:boolean;
            this.model.userType.forEach(element=>{
              
              if((this.model2[element.name].skills).length==0)
              {
                error=true;
                return;
              } 
              if((this.model2[element.name].language).length==0)
              {
                error=true;
                return;
              } 
              if((this.model2[element.name].experienced).length==0)
              {
                error=true;
                return;
              }              
            })
            if(error==true)
            {
                return;
            }
            this.responce_model={
              user:{
                first_name:this.model.first_name,
                last_name:this.model.last_name,
                country_id:this.model.country_id,
                city:this.model.city,
                email:this.model.email,
                gender:this.model.gender,
                company_name:"A",
                title:this.model.title,
                is_private:this.model.is_private,
                overview:this.model.overview
              },
              talent:[]
            }
            
            var temp=JSON.parse(JSON.stringify(this.model2));

            
            this.model.userType.forEach(element=>{
              var a=temp[element.name];
              if(a.completed_talent_steps==null || a.completed_talent_steps<=2 || a.completed_talent_steps==""||a.completed_talent_steps==undefined)
              {
                a.completed_talent_steps=2;
              }
              delete a['data'];
              a.user_type=element.id;
              a.skills=this.getIdArray(a.skills);
              a.experienced=this.getIdArray(a.experienced);
              a.language=this.getIdArray(a.language);
              a.ethnicity_id=a.ethnicity_id==""?0:a.ethnicity_id
              a.body_type_id=a.body_type_id==""?0:a.body_type_id
              a.hair_color_id=a.hair_color_id==""?0:a.hair_color_id
              a.eye_color_id=a.eye_color_id==""?0:a.eye_color_id
              a.gender=a.gender
              this.responce_model['talent'].push(a);
            });
            this.spinner.start();
            this.apiService.putRequest(CONFIG.updateTelentCrewURL+this.uuid,this.responce_model)
              .pipe(first())
              .subscribe(
                data => {
                  if (data.meta.status == true) {
                      this.spinner.stop();
                      this.router.navigateByUrl('/talent-crew-management/list');
                      this.toastr.success(data.meta.message);
                  }
                },
                error => {
                  let statusError = error;
                  this.spinner.stop();
                  if (statusError && statusError.meta) {
                    this.toastr.error(statusError.meta.message);
                  } else {
                    this.toastr.error("Something went wrong please try again.");
                  }
                });
        }

        //code for Credit
        buttonClick(frm:NgForm)
        {         
          if(!frm.valid)
          {
            return;
          }
          if(this.model_type=='Add')
          {            
            this.addProduct(frm,this.model_user_type);
          }
          if(this.model_type=='Edit')
          {
            this.editProduct();
          }
        }
        getCreditList(userType,uuid)
        {
          this.apiService.getRequest(CONFIG.getCreditListURL+uuid)
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                this.model2[userType]['data']=data['data']['user_talent_credit'];
              }
            },
            error => {
              let statusError = error;
              if (statusError && statusError.meta) {
              } else {
              }
            });
        }
        addProduct(frm:NgForm,user_type)
        {
           this.apiService.postRequest(CONFIG.addCreditURL,{
            user_talent_uuid:this.model_user_talent_uuid,
            project_name:this.model_production_name,
            production_type_id:this.model_production_type,
            production_year:this.model_pro_year,
            role:this.model_your_role,
            production_company:this.model_production_company,
            country_id:this.model_country,
            city:this.model_city
           })
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                  this.spinner.stop();
                  this.model_city="";
                  this.model_country="";
                  this.model_production_company="";
                  this.model_production_name="";
                  this.model_production_type="";
                  this.model_pro_year="";
                  this.model_your_role="";
                  this.getCreditList(this.model_user_type,this.model_user_talent_uuid);
                  this.toastr.success(data.meta.message);
              }
            },
            error => {
              let statusError = error;
              this.spinner.stop();
              if (statusError && statusError.meta) {
                this.toastr.error(statusError.meta.message);
              } else {
                this.toastr.error("Something went wrong please try again.");
              }
            });
          
          this.decline();
        }
        editProduct()
        {

          this.spinner.start();
          this.apiService.putRequest(CONFIG.updateCreditURL+this.model_update_uuid,{
            project_name:this.model_production_name,
            production_type_id:this.model_production_type,
            production_year:this.model_pro_year,
            role:this.model_your_role,
            production_company:this.model_production_company,
            country_id:this.model_country,
            city:this.model_city,
           })
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                  this.spinner.stop();
                  this.model_city="";
                  this.model_country="";
                  this.model_production_company="";
                  this.model_production_name="";
                  this.model_production_type="";
                  this.model_pro_year="";
                  this.model_your_role="";
                  this.getCreditList(this.model_user_type,this.model_user_talent_uuid);
                  this.toastr.success(data.meta.message);
              }
            },
            error => {
              let statusError = error;
              this.spinner.stop();
              if (statusError && statusError.meta) {
                this.toastr.error(statusError.meta.message);
              } else {
                this.toastr.error("Something went wrong please try again.");
              }
            });
          
          this.decline();
        }

      openModal(template: TemplateRef<any>,model_type,index,user_type,modelType?,uuid?,removeuuid?) {

        this.model_type=model_type;
        this.model_user_type=user_type;
        this.model_index=index;
        this.model_title=modelType;
        this.model_user_talent_uuid=uuid;
        if(model_type=='Edit')
        {
                  this.model_city=this.model2[user_type].data[this.model_index]['city'];
                  this.model_country=this.model2[user_type].data[this.model_index]['country_id'];
                  this.model_production_company=this.model2[user_type].data[this.model_index]['production_company'];
                  this.model_production_name=this.model2[user_type].data[this.model_index]['project_name'];
                  this.model_production_type=this.getProductionUUIDfromId(this.model2[user_type].data[this.model_index]['production_type_id']);
                  this.model_pro_year=this.model2[user_type].data[this.model_index]['production_year'];
                  this.model_your_role=this.model2[user_type].data[this.model_index]['role'];
                  this.model_update_uuid=removeuuid;
        }
        if(model_type=='Add')
        {
          this.model_production_name='';
          this.model_production_company='';
          this.model_pro_year="";
          this.model_index="";
        }
        if(model_type=="Delete")
        {
          this.removeProduct(removeuuid);
        }
        if(model_type!="Delete")
        {
          this.modalRef = this.modalService.show(template, { class: 'modal-md' });
        }
      }
  
      decline(): void {
        this.model_production_name='';
        this.model_production_company='';
        this.model_pro_year="";
        this.model_index="";
        this.modalRef.hide();
      }

      getIdArray(array)
      {
       return Array.from(array, a => (a['id']))
      }
      getObjectArray(array)
      {
        var arr=[];
        array.forEach(element => {
          arr.push({
            id:element.id,
            name:element.name
          })
        });
        return arr;
      }
      getObject(element)
      {
        element.skill=this.getObjectArray(element.skill);
        element['skills']=element.skill;
        delete element.skill;
        element.language=this.getObjectArray(element.language);              
        element.experience=this.getObjectArray(element.experience);
        element['experienced']=element.experience;
        element.ethnicity_id=element.ethnicity_id==null || element.ethnicity_id==""?"":element.ethnicity_id;
        element.body_type_id=element.body_type_id==null || element.body_type_id==""?"":element.body_type_id;
        element.hair_color_id=element.hair_color_id==null || element.hair_color_id==""?"":element.hair_color_id;
        element.eye_color_id=element.eye_color_id==null || element.eye_color_id==""?"":element.eye_color_id;
        delete element.experience;
        delete element.body_type;
        delete element.build;
        delete element.ethnicity;
        delete element.eye_color;
        delete element.hair_color;
        return element;
      }
      getProductionUUIDfromId(id)
      {
        var data="";
          this.productionTypeList.forEach(element=>{
            if(element.id==id)
            {
              data=element.uuid;
            }
          })
          return data;
      }
      removeProduct(uuid)
        {
          this.spinner.start();
           this.apiService.deleteRequest(CONFIG.deleteCreditURL+uuid,{

           })
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                  this.getCreditList(this.model_user_type,this.model_user_talent_uuid);
                  this.spinner.stop();
                  this.toastr.success(data.meta.message);
              }
            },
            error => {
              let statusError = error;
              this.spinner.stop();
              if (statusError && statusError.meta) {
                this.toastr.error(statusError.meta.message);
              } else {
                this.toastr.error("Something went wrong please try again.");
              }
            });
          
          this.decline();
        }
}
