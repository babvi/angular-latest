import { Component, OnInit, ViewChild } from '@angular/core';
/* Settings Service for API configuration */
import { SettingsService } from './../../_services/settings-service';
/* First Operations in RXJS */
import { first } from 'rxjs/operators';
/* Loader */
import { NgxSpinnerService } from 'ngx-spinner';
/* ngModel so used NgForm */
import { NgForm } from '@angular/forms';
/* Toaster for Success and Error Message */
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  /* Type Defination */
  logoURL: string;
  faviconURL: string;
  @ViewChild('f') form: any;
  private _logo_id: number;
  private _fav_id: number;
  site_name: string;
  tag_line: string;
  default_language: string;
  support_email: string;
  contact_email: string;
  profile_image: string;
  address: string;
  contact_number: number;
  noPicture: boolean;
  /* this is required as we are passing all the data in Model */
  model: any = [];
  settingsData: any = [];
  settingsDataSave: any = [];
  setOfSets = [];
  submitted: boolean = false; // this is used form validate
  ImageData: any;
  profile_logo: string;
  profile_favicon: string;

  constructor(private settingsservice: SettingsService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getSettingsData(); // Calling this function on loading page
    this.logoURL = 'assets/default-user-image.png';
    this.faviconURL = 'assets/default-user-image.png';
  }

  /* get API Response for binding to HTML */
  getSettingsData() {
    this.getImageData(); // Getting Image Response and Bind the same
    this.settingsservice.getSettingsDataURL()
    .pipe(first())
    .subscribe(
      data => {
        this.settingsData = data.data;
        /* Binding all the data */
        this.model.site_name = data.data[0].option_value;
        this.model.tag_line = data.data[1].option_value;
        this.model.default_language = data.data[2].option_value;
        this.model.support_email = data.data[3].option_value;
        this.model.contact_email = data.data[4].option_value;
        this.model.contact_number = data.data[5].option_value;
        this.model.address = data.data[6].option_value;
        this._logo_id = data.data[7].id;
        this._fav_id = data.data[8].id;
        /* store value as string in localstorage for remove function */
        localStorage.setItem('logo_id_value', JSON.stringify(this._logo_id));
        localStorage.setItem('fav_id_value', JSON.stringify(this._fav_id));
      },
      error => {
        console.log(error);
      });
    }

    /* On Submit Function */
    onSettingsDataSave(frm: NgForm) {
      this.submitted = true;
      if (frm.invalid) {
        return;
      }
      this.spinner.show();

      /* FormData for pushing the code with Image URL */
      const formData: FormData = new FormData();
      formData.append('site_name', this.model.site_name);
      formData.append('tag_line', this.model.tag_line);
      formData.append('default_language', this.model.default_language);
      formData.append('support_email', this.model.support_email);
      formData.append('contact_email', this.model.contact_email);
      formData.append('address', this.model.address);
      formData.append('status', 'Active');

      /* Get Logo file */
      let fileLOGO = (<HTMLInputElement>document.getElementById("profile_logo")).files[0];
      /* Get Favicon file */
      let fileFAV = (<HTMLInputElement>document.getElementById("profile_favicon")).files[0];

      /* Check Logo & Favicon file */
      if (fileLOGO) {
        formData.append('logo', fileLOGO);
      }
      if (fileFAV) {
        formData.append('favicon', fileFAV);
      }

      /* Call Update function */
      this.updateSettingsData(formData);
    }

    /* Update Method */
    updateSettingsData(formData) {
      this.spinner.show();
      this.settingsDataSave = this.settingsservice.updateSettingsDataURL(formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            /* Delay in Hide the Spinner */
            setTimeout(() => {
              this.spinner.hide();
            }, 2000);
            this.toastr.success(data.meta.message);
          }
        },
        error => {
          let errorData = error;
          if (errorData && errorData.meta) {
            if (errorData.meta.message_code == 'VALIDATION_ERROR') {
              if (errorData.errors.page_title) {
                this.toastr.error(errorData.errors.page_title[0]);
                this.spinner.hide();
              }
            } else {
              this.toastr.error(errorData.meta.message);
              this.spinner.hide();
            }
          } else {
            this.toastr.error("Something went wrong please try again.");
            this.spinner.hide();
          }
          this.submitted = false;
          this.spinner.hide();
        });
      }

      /* Get Image Data from API */
      getImageData() {
        this.settingsservice.getSettingsImageDataURL()
        .pipe(first())
        .subscribe(
          data => {
            this.ImageData = data.data;
            if(data.data.logo) {
              this.logoURL = data.data.logo;
            }
            if(data.data.favicon) {
              this.faviconURL = data.data.favicon;
            }
          },
          error => {
            console.log(error);
          });
        };

        /* Change Logo Image */
        changeLogoImage(event:any) {
          if (event.target.files[0] != undefined) {
            let imgSize = 2;
            let temp;
            let fileTypes = ["image/jpeg", "image/jpg", "image/png"];
            if ($.inArray(event.target.files[0].type, fileTypes) == -1) {
              this.toastr.error('Please upload a valid image.');
            } else {
              if (((temp = imgSize) === (void 0) || temp === '') || (event.target.files[0].size / 1024) / 1024 < imgSize) {
                let reader = new FileReader();
                reader.onload = (event:any) => {
                  this.logoURL = event.target.result;
                }
                reader.readAsDataURL(event.target.files[0]);
              } else {
                this.toastr.error("File Size should be smaller than " + imgSize + "MB");
              }
            }
          } else {
            this.logoURL = 'assets/default-user-image.png';
          }
          this.noPicture = false;
        }

        /* Change Favicon Image */
        changeFavImage(event:any) {
          if (event.target.files[0] != undefined) {
            let imgSize = 2;
            let temp;
            let fileTypes = ["image/jpeg", "image/jpg", "image/png"];
            if ($.inArray(event.target.files[0].type, fileTypes) == -1) {
              this.toastr.error('Please upload a valid image.');
            } else {
              if (((temp = imgSize) === (void 0) || temp === '') || (event.target.files[0].size / 1024) / 1024 < imgSize) {
                let reader = new FileReader();
                reader.onload = (event:any) => {
                  this.faviconURL = event.target.result;
                }
                reader.readAsDataURL(event.target.files[0]);
              } else {
                this.toastr.error("File Size should be smaller than " + imgSize + "MB");
              }
            }
          } else {
            this.faviconURL = 'assets/default-user-image.png';
          }
          this.noPicture = false;
        }

        /* remove logo */
        removeLogoPicture() {
          /* convert string value to number type */
          let logo_id_value = JSON.parse(localStorage.getItem('logo_id_value'));
          this.settingsservice.removeImage(logo_id_value)
          .pipe(first())
          .subscribe(
            data => {
              if (data.meta.status == true) {
                this.logoURL = 'assets/default-user-image.png';
                this.profile_logo = 'assets/default-user-image.png';
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
          };

          /* remove favicon */
          removeFavPicture() {
            /* convert string value to number type */
            let fav_id_value = JSON.parse(localStorage.getItem('fav_id_value'));
            this.settingsservice.removeImage(fav_id_value)
            .pipe(first())
            .subscribe(
              data => {
                if (data.meta.status == true) {
                  this.faviconURL = 'assets/default-user-image.png';
                  this.profile_favicon = 'assets/default-user-image.png';
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
            };
          }
