import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { NgForm } from '@angular/forms';//
import { Router } from '@angular/router';
import { CONFIG } from './../../config/app-config';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  firstname: string;
  lastname: string;
  username: string;
  email: string;
  oldpass: string;
  newpass: string;
  confirmpass: string;
  constructor(private http: HttpClient, public router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.http.get(CONFIG.getUserProfileIdURL).subscribe(
      res => {
        var profiledata = res['data'];
        this.firstname = profiledata.first_name;
        this.lastname = profiledata.last_name;
        this.username = profiledata.username;
        this.email = profiledata.email;
      },
      msg => console.error(`Error: Something went wrong,Please try again later`)
    );
  }

  updateProfile() {

    let data = {
      first_name: this.firstname,
      last_name: this.lastname
    }
    this.http.put(CONFIG.updateProfileInfoURL, data).subscribe(
      res => {
        var loginUser=JSON.parse(localStorage.getItem("currentUser"));
        loginUser.data.user_detail.first_name=(this.firstname).trim();
        loginUser.data.user_detail.last_name=(this.lastname).trim();
        localStorage.setItem("currentUser",JSON.stringify(loginUser));
        let loginUserText = <HTMLElement> document.querySelector(".login_user_name");
        loginUserText.innerText=(this.firstname).trim();
        this.toastr.success(res['meta']['message'], '', {
          timeOut: 3000,
          closeButton: true
        });
      },
      msg => {
        if (msg != "Unauthorized") {
          this.toastr.error(`Error: Something went wrong,Please try again later`, '', {
            timeOut: 3000,
            closeButton: true
          });
        }
      }
    );
  }

  changePassword(frm:NgForm) {
    let data = {
      old_password: this.oldpass,
      new_password: this.newpass,
      confirm_password: this.confirmpass
    }
    this.http.put(CONFIG.changeProfilePassURL, data).subscribe(
      res => {
        this.oldpass=null;
        this.newpass=null;
        this.confirmpass=null;
        frm.reset();
        this.toastr.success(res['meta']['message'], '', {
          timeOut: 3000,
          closeButton: true
        });
      },
      msg => {
        if (msg != "Unauthorized") {
          this.toastr.error(`Error: Something went wrong,Please try again later`, '', {
            timeOut: 3000,
            closeButton: true
          });
        }
      }
    );
  }

}
