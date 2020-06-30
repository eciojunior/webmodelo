import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDataComponent } from './userdata/userdata.component';
import { UserListComponent } from './userlist/userlist.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedComponentsModule } from 'src/app/shared/components/shared.components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    TextMaskModule,
    UserRoutingModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule
  ],
  declarations: [UserDataComponent, UserListComponent]
})
export class UserModule { }
