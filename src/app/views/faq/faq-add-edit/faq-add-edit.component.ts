import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FaqService } from './../../../_services/faq-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Faq } from './../../../model/faq';

@Component({
  selector: 'app-faq-add-edit',
  templateUrl: './faq-add-edit.component.html',
  styleUrls: ['./faq-add-edit.component.scss']
})
export class FaqAddEditComponent implements OnInit {

  @ViewChild('f') form: any;

  private _id: number;
  editMode: boolean = false;
  editFaqId: number;
  submitted: boolean = false;
  faq_subject: string;
  faq_body: string;
  topicListData: any;
  routeSub: Subscription;
  faqSub: Subscription;
  faqTopicList: Subscription;
  faqSaveSub: Subscription;
  model: any = new Faq('', '', '', '', 'Active');
  addEditCmsForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private faqService: FaqService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.faqTopicList = this.faqService.getFaqTopicList()
      .pipe(first())
      .subscribe(
        response => {
          this.topicListData = response.data;
        },
        error => {
          console.log(error);
        });

    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this.editMode = params['id'] != null;
        setTimeout(() => {
          this.initForm();
        }, 100);
      });
  }

  initForm() {
    if (this.editMode) {
      this.faqSub = this.faqService.getFaqById(this._id)
        .pipe(first())
        .subscribe(
          response => {
            this.editFaqId = response.data.id || null;
            this.model.faq_topic = response.data.faq_topic_id || '';
            this.model.question = response.data.question || '';
            this.model.answer = response.data.answer || '';
            this.model.status =  response.data.status || 'Active';
          },
          error => {
            console.log(error);
          });
    }

  }

  onFaqSave() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.editFaqId) {
      this.updateFaq(this.form.value, this.editFaqId);
    } else {
      this.createFaq(this.form.value);
    }
  }

  createFaq(formData) {
    this.faqSaveSub = this.faqService.createFaq(formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/faq/list']);
          }
        },
        error => {
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
            this.router.navigate(['/faq/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  updateFaq(formData, id) {
    this.faqSaveSub = this.faqService.updateFaq(formData, id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/faq/list']);
          }
        },
        error => {
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
            this.router.navigate(['/faq/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.faqTopicList.unsubscribe();
    if (this.editMode) {
      this.faqSub.unsubscribe();
    }
  }

}
