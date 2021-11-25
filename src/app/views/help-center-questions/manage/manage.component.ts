import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, EventEmitter, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';

import { CONFIG } from './../../../config/app-config';
import { first } from 'rxjs/operators';
import { NgForm, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from './../../../_services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-manage-help-questions',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})

export class ManageComponent implements OnInit {
    public searchElementRef: ElementRef;

    IsEditMode: boolean = false;

    uuid: string;
    modalRef: BsModalRef;
    model: any = {
        question: {},
        answer: {},
        category_type_id: 0
    };
    config=CONFIGCONSTANTS["CK-Editor-config"];
    siteLanguage: Object;
    parentCategoryList: string[];
    ck_error: any[];
    languages:any[]=[];
    buttonDisable: boolean = false;
    loader:any;
    constructor(private toastr: ToastrService,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private apiService: ApiService,
        private Router: Router,
        private spinner: NgxUiLoaderService,
        private ngZone: NgZone) {

    }

    ngOnInit() {
        this.loader = CONFIGCONSTANTS.loaderConfig;
        this.getParentCategories();
        this.languages=JSON.parse(localStorage.getItem('currentUser')).data.languages;
        this.route.params
            .subscribe(params => {
                this.uuid = params['uuid'] || '';

                // Manage edit mode
                this.IsEditMode = this.uuid != '' ? true : false;
                if (this.IsEditMode) {
                    this.spinner.start();
                    this.getQuestion();
                }
                let currentUser = localStorage.getItem('currentUser');
                let currentUserJson = JSON.parse(currentUser);
                let objLanguages = currentUserJson.data.languages;
                let questionField = {};
                let answerField = {};
                let siteLanguage = {};
                let ckError = [];
                objLanguages.forEach(element => {
                    questionField[element.locale] = '';
                    answerField[element.locale] = '';
                    siteLanguage[element.locale] = element.name;
                    ckError[element.locale] = true;
                });
                this.siteLanguage = siteLanguage;
                this.model['question'] = questionField;
                this.model['answer'] = answerField;
                this.ck_error = ckError;
                if(!this.IsEditMode)
                {
                 this.model['category_type_id']='';
                 
                }
            });
    }

    /**
     * Get parent Categories
     */
    getParentCategories(): void {
        this.apiService.getRequest(CONFIG.getAllHCCListURL)
            .pipe(first())
            .subscribe(
            data => {
                this.parentCategoryList = data.data;
            },
            error => {
                console.log(error);
            });
    }

    /**
     * Submit Form
     * @param frm 
     */
    submitForm(frm: NgForm) {
        if (frm.invalid) {
            window.scroll(0, 130);
            return false;
        }
        var any_error=false;
        var val=Object.values(this.ck_error)
        val.forEach(element=>{
            if(element==true)
            {
                any_error=true;
            }
        })
    
        if (frm.valid && any_error==false) {
            this.saveForm(frm);
        }
    }

    getCKData(type) {
       
        if (type != 'ar') {
            let a = (this.model.answer[type]).substring((this.model.answer[type]).indexOf("<body>") + 6, (this.model.answer[type]).indexOf("</body>"));
            this.ck_error[type] = a.length > 0 ? false : true;
        } else {
            
            let a = (this.model.answer[type]).substring((this.model.answer[type]).indexOf('<body dir="rtl">') + 16, (this.model.answer[type]).indexOf("</body>"));
            this.ck_error[type] = a.length > 0 ? false : true;
            
        }
      }
    checkCKLength(type,data)
    {
        if (type != 'RTL') {
            
            
            let a = (data).substring((data).indexOf("<body>") + 6, (data).indexOf("</body>"));
            
            
            return a.length > 0 ? false : true;
        } else {
            
            let a = (data).substring((data).indexOf('<body dir="rtl">') + 16, (data).indexOf("</body>"));
            
            return a.length > 0 ? false : true;
        }
    }
    /**
     * Save property
     *
     * @param frm 
     */
    saveForm(frm: NgForm) {
        let self = this;
        this.spinner.start();
        if (this.IsEditMode) {
            this.model.uuid = this.uuid;
            this.apiService.putRequest(CONFIG.updateHCQURL + "/" + this.model.uuid, this.model)
                .pipe(first())
                .subscribe((Response: any) => {
                    self.saveFormCallback(frm, Response);
                },
                (errors: any) => {
                    self.saveFormErrorCallback(errors);
                });
        } else {
            this.apiService.postRequest(CONFIG.createHCQURL, this.model)
                .pipe(first())
                .subscribe((Response: any) => {
                    self.saveFormCallback(frm, Response);
                },
                (errors: any) => {
                    self.saveFormErrorCallback(errors);
                });
        }
    }

    /**
     * Save property API call success callback
     *
     * @param frm 
     * @param Response 
     */
    saveFormCallback(frm: NgForm, Response: any): void {
        if (Response.meta.status && (Response.meta.status_code == 201 || Response.meta.status_code == 200)) {
            this.toastr.success(Response.meta.message);
            this.Router.navigate(['/help-center-management/questions/']);
            frm.resetForm();
            setTimeout(() => {
                this.spinner.stop()
            }, 500);
        } else {
            this.toastr.error(Response.meta.message);
            this.spinner.stop()
        }
    }

    /**
     * Save property API call error callback
     *
     * @param errors 
     */
    saveFormErrorCallback(errors: any): void {
        Object.keys(errors.errors).forEach(function (key) {
            this.toastr.error(errors.errors[key]);
        });
        setTimeout(() => {
            this.spinner.stop()
        }, 500);
    }

    private getQuestion(): void {
        let self = this;
        this.spinner.start();
        this.apiService.getRequest(CONFIG.getHCQByIdURL + '/' + this.uuid)
            .pipe(first())
            .subscribe((Response: any) => {
                if (Response.meta.status_code == 200) {
                    var resData = Response.data;
                    this.model.category_type_id = resData.category_type_id;
                    resData.translations.forEach(element => {
                        this.model.question[element.locale] = element.question;
                        this.model.answer[element.locale] = element.answer;
                        this.languages.forEach(lan=>{

                            this.ck_error[lan.locale]=this.checkCKLength(lan.text_direction,this.model.answer[lan.locale]);
                        })
                    });
                    this.spinner.stop();
                } else {
                    self.toastr.error(Response.meta.message);
                    this.spinner.stop()
                    this.Router.navigate(['/help-center-management/questions/']);
                }
            }, (error: any) => {
                this.spinner.stop();
                self.toastr.error(error.meta.message);
                this.Router.navigate(['/help-center-management/questions/']);
            })
    }

}
