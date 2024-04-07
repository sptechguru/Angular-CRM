[1mdiff --git a/src/app/layouts/new-cutomer-mangement/create-user/create-user.component.html b/src/app/layouts/new-cutomer-mangement/create-user/create-user.component.html[m
[1mindex dd4ff8f..d6fd257 100644[m
[1m--- a/src/app/layouts/new-cutomer-mangement/create-user/create-user.component.html[m
[1m+++ b/src/app/layouts/new-cutomer-mangement/create-user/create-user.component.html[m
[36m@@ -153,20 +153,40 @@[m
                                     </mat-form-field>[m
                                 </div>[m
 [m
[32m+[m[32m                                <div class="col-md-6">[m
[32m+[m[32m                                    <mat-form-field appearance="outline" class="mb-4">[m
[32m+[m[32m                                        <mat-label>Address 1</mat-label>[m
[32m+[m[32m                                        <input matInput type="text" formControlName="address_line_1"  [errorStateMatcher]="matcher"  />[m
[32m+[m[32m                                        <!-- <mat-error *ngIf="f.business_name.hasError('required')">[m
[32m+[m[32m                                            Business Name is <strong>required</strong>[m
[32m+[m[32m                                        </mat-error> -->[m
[32m+[m[32m                                    </mat-form-field>[m
[32m+[m[32m                                </div>[m
[32m+[m
[32m+[m
 [m
                                 <div class="col-md-6">[m
                                     <mat-form-field appearance="outline" class="mb-4">[m
[31m-                                        <mat-label>Business Type</mat-label>[m
[31m-                                        <mat-select formControlName="business_type"  [errorStateMatcher]="matcher">[m
[31m-                                            <mat-option value="private">Private</mat-option>[m
[31m-                                            <!-- <mat-option value="public">Public</mat-option> -->[m
[31m-                                        </mat-select>[m
[31m-                                        <mat-error *ngIf="f.business_type.hasError('required')">[m
[31m-                                            Business Type is <strong>required</strong>[m
[31m-                                        </mat-error>[m
[32m+[m[32m                                        <mat-label>Address 2</mat-label>[m
[32m+[m[32m                                        <input matInput type="text" formControlName="address_line_1"  [errorStateMatcher]="matcher"  />[m
[32m+[m[32m                                        <!-- <mat-error *ngIf="f.business_name.hasError('required')">[m
[32m+[m[32m                                            Business Name is <strong>required</strong>[m
[32m+[m[32m                                        </mat-error> -->[m
[32m+[m[32m                                    </mat-form-field>[m
[32m+[m[32m                                </div>[m
[32m+[m
[32m+[m
[32m+[m[32m                                <div class="col-md-6">[m
[32m+[m[32m                                    <mat-form-field appearance="outline" class="mb-4">[m
[32m+[m[32m                                        <mat-label>Pincode</mat-label>[m
[32m+[m[32m                                        <input matInput type="text" formControlName="pincode"  [errorStateMatcher]="matcher"  />[m
[32m+[m[32m                                        <!-- <mat-error *ngIf="f.business_name.hasError('required')">[m
[32m+[m[32m                                            Business Name is <strong>required</strong>[m
[32m+[m[32m                                        </mat-error> -->[m
                                     </mat-form-field>[m
                                 </div>[m
 [m
[32m+[m
                                 <div class="col-md-6">[m
                                     <mat-form-field appearance="outline" class="mb-4">[m
                                         <mat-label>Gst Number</mat-label>[m
[36m@@ -208,10 +228,10 @@[m
                                 </div> -->[m
 [m
                             </div>[m
[31m-                            <button type="submit" [disabled]="createUserForm.invalid" class="btn btn-danger mx-auto">Draft[m
[32m+[m[32m                            <button type="submit" class="btn btn-danger mx-auto">Draft[m
                             </button>[m
 [m
[31m-                            <button type="submit" (click)="userUpdateMethod()" class="btn btn-primary mx-3">Save And Send[m
[32m+[m[32m                            <button type="submit" class="btn btn-primary mx-3">Save And Send[m
                             </button>[m
                         </form>[m
                     </ng-container>[m
