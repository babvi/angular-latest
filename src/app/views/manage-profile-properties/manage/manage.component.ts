import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, EventEmitter, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { CONFIG } from './../../../config/app-config';
import { first } from 'rxjs/operators';
import { NgForm, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { error } from 'util';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from './../../../_services/api.service';
import { ManageuserService } from './../../../_services/manageuser-service';

import { BootstrapOptions } from '@angular/core/src/application_ref';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscriber, Observer, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
@Component({
    selector: 'app-manage-campaign-ads',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})

export class ManageComponent implements OnInit {
    public searchElementRef: ElementRef;

    IsEditMode: boolean = false;

    uuid: string;
    modalRef: BsModalRef;
    model: any = {
        property_type: '',
        name: {},
        is_active: 1
    };

    siteLanguage: Object;
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
        this.getPropertyTypes();
        this.route.params
            .subscribe(params => {
                this.uuid = params['uuid'] || '';
            });

        // Manage edit mode
        this.IsEditMode = this.uuid != '' ? true : false;
        if (this.IsEditMode) {
            this.spinner.start();
            this.getProperty();
        }
        let currentUser = localStorage.getItem('currentUser');
        let currentUserJson = JSON.parse(currentUser);
        let objLanguages = currentUserJson.data.languages;
        let nameField = {};
        let siteLanguage = {};
        objLanguages.forEach(element => {
            nameField[element.locale] = '';
            siteLanguage[element.locale] = element.name;
        });
        this.siteLanguage = siteLanguage;
        this.model['name'] = nameField;
    }

    /**
     * Get property types
     */
    getPropertyTypes(): void {
        this.apiService.getRequest(CONFIG.profileProperties.getPropertyTypes)
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
     * Submit Form
     * @param frm 
     */
    submitForm(frm: NgForm) {
        if (frm.invalid) {
            window.scroll(0, 130);
            return false;            
        }

        if (frm.valid) {
            this.saveProperty(frm);
        }
    }

    /**
     * Save property
     *
     * @param frm 
     */
    saveProperty(frm: NgForm) {
        let self = this;
        this.spinner.start();
        if (this.IsEditMode) {
            this.model.uuid = this.uuid;
            this.apiService.putRequest(CONFIG.profileProperties.getUpdateRecordURL, this.model)
                .pipe(first())
                .subscribe((Response: any) => {
                    self.savePropertyCallback(frm, Response);
                },
                (errors: any) => {
                    self.savePropertyErrorCallback(errors);
                });
        } else {
            this.apiService.postRequest(CONFIG.profileProperties.getAddRecordURL, this.model)
                .pipe(first())
                .subscribe((Response: any) => {
                    self.savePropertyCallback(frm, Response);
                },
                (errors: any) => {
                    self.savePropertyErrorCallback(errors);
                });
        }
    }

    /**
     * Save property API call success callback
     *
     * @param frm 
     * @param Response 
     */
    savePropertyCallback(frm: NgForm, Response: any):void {
        var that=this;
                
        if (Response.meta.status && ( Response.meta.status_code == 200 || Response.meta.status_code == 201 )) {
            that.toastr.success(Response.meta.message);
            // that.Router.navigate(['/skill-management']);
            that.Router.navigateByUrl('/skill-management');
            frm.resetForm();
            setTimeout(() => {
                that.spinner.stop()
            }, 500);
        } else {
            that.toastr.error(Response.meta.message);
            that.spinner.stop()
        }
    }

    /**
     * Save property API call error callback
     *
     * @param errors 
     */
    savePropertyErrorCallback(errors: any):void {
        console.log('errors'+errors);
        var that=this;
        Object.keys(errors.errors).forEach(function (key) {
            that.toastr.error(errors.errors[key]);
        });
        setTimeout(() => {
            this.spinner.stop()
        }, 500);
    }

    private getProperty():void {
        let self = this;
        this.spinner.start();
        this.apiService.getRequest(CONFIG.profileProperties.getPropertyType + '/' + this.uuid)
            .pipe(first())
            .subscribe((Response: any) => {
                if (Response.meta.status_code == 200) {
                    var resData = Response.data;


                    this.model.property_type = resData.property_type;
                    this.model.is_active = resData.is_active;
                    resData.translations.forEach(element => {
                        this.model.name[element.locale] = element.name;
                    });
                    this.spinner.stop();
                } else {
                    self.toastr.error(Response.meta.message);
                    this.spinner.stop()
                    this.Router.navigate(['/skill-management']);
                }
            }, (error: any) => {
                this.spinner.stop();
                self.toastr.error(error.meta.message);
                this.Router.navigate(['/skill-management']);
            })
    }
    
}
