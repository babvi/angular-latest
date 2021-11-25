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
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
@Component({
    selector: 'app-manage-help-categories',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})

export class ManageComponent implements OnInit {
    public searchElementRef: ElementRef;

    IsEditMode: boolean = false;

    uuid: string;
    modalRef: BsModalRef;
    model: any = {
        title: {},
        description: {},
        is_parent: 1,
        parent_id: 0,
        category_type_id: 0
    };

    siteLanguage: Object;
    parentCategoryList: string[];
    propertyTypeList: string[];
    loader:any;
    constructor(private toastr: ToastrService,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private apiService: ApiService,
        private Router: Router,
        private spinner:NgxUiLoaderService,
        private ngZone: NgZone) {

    }

    ngOnInit() {

        this.loader = CONFIGCONSTANTS.loaderConfig;
        this.getParentCategories();
        this.getPropertyTypes();
        this.route.params
            .subscribe(params => {
                this.uuid = params['uuid'] || '';
            });

        // Manage edit mode
        this.IsEditMode = this.uuid != '' ? true : false;
        if (this.IsEditMode) {
            this.spinner.start();
            this.getCategory();
        }
        let currentUser = localStorage.getItem('currentUser');
        let currentUserJson = JSON.parse(currentUser);
        let objLanguages = currentUserJson.data.languages;
        let nameField = {};
        let descField = {};
        let siteLanguage = {};
        objLanguages.forEach(element => {
            nameField[element.locale] = '';
            descField[element.locale] = '';
            siteLanguage[element.locale] = element.name;
        });
        this.siteLanguage = siteLanguage;

        this.model['title'] = nameField;
        this.model['description'] = descField;
        this.model['category_type_id']=this.model['category_type_id']==0?'':this.model['category_type_id'];
        
    }

    /**
     * Get property types
     */
    getPropertyTypes(): void {
        this.apiService.getRequest(CONFIG.profileProperties.getServices + "?property_type=help-center-category")
            .pipe(first())
            .subscribe(
            data => {
                this.propertyTypeList = data.data;
            },
            error => {
                console.log(error);
            });
    }

    /**
     * Get parent Categories
     */
    getParentCategories(): void {
        this.apiService.getRequest(CONFIG.getAllHCCListURL + "?is_parent=1")
            .pipe(first())
            .subscribe(
            data => {
                this.parentCategoryList=[];
                data.data.forEach((element,index)=>{
                    if(element.uuid!=this.uuid)
                    {
                        this.parentCategoryList.push(element);
                    }
                })
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
        if (frm.valid) {
            this.saveCategory(frm);
        }
    }

    /**
     * Save property
     *
     * @param frm 
     */
    saveCategory(frm: NgForm) {
        let self = this;
        var model_data=this.model;
        if(this.model.parent_id==0 || this.model.parent_id==null || this.model.parent_id=='')
        {
            delete model_data['parent_id'];
        }
        if(this.model.is_parent==1 && (this.model.parent_id!=0 && this.model.parent_id!=null && this.model.parent_id!=''))
        {
            delete model_data['parent_id'];
        }
        this.spinner.start();
        if (this.IsEditMode) {
            this.model.uuid = this.uuid;
            this.apiService.putRequest(CONFIG.updateHCCURL + "/" + this.model.uuid,model_data)
                .pipe(first())
                .subscribe((Response: any) => {
                    self.saveCategoryCallback(frm, Response);
                },
                (errors: any) => {
                    self.saveCategoryErrorCallback(errors);
                });
        } else {
            this.apiService.postRequest(CONFIG.createHCCURL, this.model)
                .pipe(first())
                .subscribe((Response: any) => {
                    self.saveCategoryCallback(frm, Response);
                },
                (errors: any) => {
                    self.saveCategoryErrorCallback(errors);
                });
        }
    }

    /**
     * Save property API call success callback
     *
     * @param frm 
     * @param Response 
     */
    saveCategoryCallback(frm: NgForm, Response: any): void {
        var self=this;
        if (Response.meta.status && (Response.meta.status_code == 201 || Response.meta.status_code == 200)) {
            self.toastr.success(Response.meta.message);
            self.Router.navigate(['help-center-management/categories']);
            frm.resetForm();
            setTimeout(() => {
                self.spinner.stop()
            }, 500);
        } else {
            self.toastr.error(Response.meta.message);
            self.spinner.stop()
        }
    }

    /**
     * Save property API call error callback
     *
     * @param errors 
     */
    saveCategoryErrorCallback(errors: any): void {
        var self=this;
        Object.keys(errors.errors).forEach(function (key) {
            self.toastr.error(errors.errors[key]);
        });
        setTimeout(() => {
            self.spinner.stop()
        }, 500);
    }

    private getCategory(): void {
        let self = this;
        this.spinner.start();
        this.apiService.getRequest(CONFIG.getHCCByIdURL + '/' + this.uuid)
            .pipe(first())
            .subscribe((Response: any) => {
                if (Response.meta.status_code == 200) {
                    var resData = Response.data;
                    this.model.category_type_id = resData.category_type_id;
                    this.model.is_parent = resData.is_parent;
                    this.model.parent_id=resData.parent_id;
                    resData.translations.forEach(element => {
                        this.model.title[element.locale] = element.title;
                        this.model.description[element.locale] = element.description;
                    });
                    this.spinner.stop();
                } else {
                    self.toastr.error(Response.meta.message);
                    this.spinner.stop()
                    this.Router.navigate(['help-center-management/categories']);
                }
            }, (error: any) => {
                this.spinner.stop();
                self.toastr.error(error.meta.message);
                this.Router.navigate(['help-center-management/categories']);
            })
    }

}
