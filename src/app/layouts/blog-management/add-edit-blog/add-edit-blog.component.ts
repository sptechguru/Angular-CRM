import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MyErrorStateMatcher } from "app/layouts/crm-user/add-crm-user/add-crm-user.component";
import { API } from "app/shared/constants/endpoints";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { ToasterService } from "app/shared/services/toaster.service";
@Component({
  selector: "app-add-edit-blog",
  templateUrl: "./add-edit-blog.component.html",
  styleUrls: ["./add-edit-blog.component.css"],
})
export class AddEditBlogComponent implements OnInit {
  public Editor = ClassicEditor;
  matcher = new MyErrorStateMatcher();
  filePath: string;
  myForm: FormGroup;
  saving: boolean = false;
  constructor(
    public fb: FormBuilder,
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.myForm = this.fb.group({
      img: [null],
      filename: [""],
      title: ["", Validators.required],
      // sub_title: ["", Validators.required],
      position: ["", Validators.required],
      detail: ["", Validators.required],
      status: ["", Validators.required],

    });
  }
  ngOnInit(): void {
    this.getBlogDetails();
  }
  imagePreview(e) {
    const file = (e.target as HTMLInputElement).files[0];

    this.myForm.patchValue({
      img: file,
    });

    this.myForm.get("img").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  get formControl() {
    return this.myForm.controls;
  }

  getBlogDetails() {
    if (!this.route.snapshot.params.id) return;
    const api = API.CRM_ENDPOINTS.GET_BLOG_DETAILS(
      this.route.snapshot.params.id
    );
    this._api.apiGet(api).subscribe({
      next: (next) => {
        // console.log(next)
        this.myForm.patchValue({
          title: next.data.title,
          // sub_title: next.data.sub_title,
          position: next.data.position,
          detail: next.data.detail,
          status:next.data.status,
          id: next.data.id,
        });

        this.filePath = next.data.blog_image;
        next.data.detail;
      },
      error: (err) => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err);

        this.saving = false;
      },
      complete: () => {
        this.saving = false;
      },
    });
  }

  uploadBlog() {
    const endpoint = this.route.snapshot.params.id
      ? API.CRM_ENDPOINTS.UPDATE_BLOG(this.route.snapshot.params.id)
      : API.CRM_ENDPOINTS.CREATE_BLOG;
    //  console.log(this.myForm.value);
    if (this.myForm.invalid) return;
    this.saving = true;
    const formData: FormData = new FormData();
    if (this.myForm.value.img) {
      formData.append(
        "blog_image",
        this.myForm.value.img,
        this.myForm.value.name
      );
    }
    formData.append("title", this.myForm.value.title);
    // formData.append("sub_title", this.myForm.value.sub_title);
    formData.append("position", this.myForm.value.position);
    formData.append("detail", this.myForm.value.detail);
    formData.append("status", this.myForm.value.status);
    this._api
      .apiPost(
        endpoint,
        formData,
        {},
        { contentType: { isFormDataContent: true } }
      )
      .subscribe({
        next: (next) => {
          // console.log(next);
          if (next.success) {
          this.toaster.Success(next.message);
          this.router.navigate(["/crm/blog-management"]);
          this.saving = false;
          }
          else{
            if (next.error && next.error.message) {
              this.toaster.Error(next.error.message);
            }
          }
        },
        error: (err) => {
          if (typeof err == "string") {
            this.toaster.Error(err);
             this.saving = false;
          } else if (err.error && err.error.message) {
            this.toaster.Error(err.error.message);
          }
          // console.log(err)
        },
        complete: () => {
          this.saving = false;
        },
      });
  }
}
