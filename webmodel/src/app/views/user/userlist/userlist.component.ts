import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { RestService } from 'src/app/shared/services/rest.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss'],
    animations: [SharedAnimations]
})
export class UserListComponent implements OnInit{
    searchControl: FormControl = new FormControl();
    data;
    filtered;
  
    constructor(
      private restService: RestService,
      private toastr: ToastrService,
      private modalService: NgbModal
    ) { }

    changeAutority (id, authority) {
      let urlParam = [id];
      let queryString = {
        authority: authority
      }
      this.restService.callApi("userChangeAuthority", queryString, urlParam).then(p => {
        this.updateGrid();
        this.toastr.success("Permissão de usuário alterada com sucesso!");
      });
    };
  
    ngOnInit() {
      this.updateGrid();
      this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filterData(value);
      });
    }

    private updateGrid () {
      this.restService.callApi("getAllUser").then(resp => {
        this.data = resp["body"] || [];
        this.filtered = this.data ;
      });
    }
  
    filterData(val) {
      if (val) {
        val = val.toLowerCase();
      } else {
        return this.filtered = [...this.data];
      }
  
      const columns = Object.keys(this.data[0]);
      if (!columns.length) {
        return;
      }
      const rows = this.data.filter(function(d) {
          return columns.filter(c => {
            return d[c] && d[c].toString().toLowerCase().indexOf(val) > -1;
          }).length;
      });
      this.filtered = rows;
    }

    confirm(content, id, authority) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this.changeAutority (id, authority);
      }, (e) => {});
    }
}
