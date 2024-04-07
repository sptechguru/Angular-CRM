import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogManagementComponent } from './blog-management.component';
import { Routes, RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from 'app/shared/shared.module';
import { AddEditBlogComponent } from './add-edit-blog/add-edit-blog.component';

const routes: Routes = [
  { path: '', component: BlogManagementComponent },
  { path: 'add-blog', component: AddEditBlogComponent },
  { path: ':id', component: AddEditBlogComponent },
  

]

@NgModule({
  declarations: [BlogManagementComponent, AddEditBlogComponent],
  imports: [
    CommonModule,
    SharedModule,
    CKEditorModule,
    RouterModule.forChild(routes),

  ],
  bootstrap: []
})
export class BlogManagementModule { }
