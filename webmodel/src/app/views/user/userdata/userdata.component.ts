import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { RestService } from 'src/app/shared/services/rest.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: './userdata.component.html',
    styleUrls: ['./userdata.component.scss'],
    animations: [SharedAnimations]
})
export class UserDataComponent implements OnInit{
    formUser: FormGroup;
    formIndicate: FormGroup;
    phoneMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    userIndicate = {
      present: false,
    }

    constructor(
      private restService: RestService,
      private auth: AuthService,
      private toastr: ToastrService,
      private fb: FormBuilder,
      private modalService: NgbModal
    ) { }

    changePhoto(content) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
    }

    myUrl = window.location.origin + '/#/?userIndicate=' + this.auth.getuser()["id"];

    setPhoto(url: String) {
      if ("http" != url.substring(0, 4)) {
        this.toastr.info("A URL seleciona não é valida!");
        return;
      }
      let val = this.formUser.value;
      val["photo"] = url;
      val["authority"] = this.auth.getuser()["authority"].toUpperCase()
      this.formUser.setValue(val);
      this.modalService.dismissAll();
      this.changeLeft();
    }

    changeLeft(time?) {
      var check = function(){
        let width = document.getElementById("userPhoto").offsetWidth;
        if(width > 0){
          document.getElementById("editPhoto").style.marginLeft = (50 + (width / 2) - 20).toString() + 'px';
        }
        else {
          setTimeout(check, 100);
        }
      }
      setTimeout(check, time || 50);
    }

    submit() {
      this.restService.callApi("updateUser", this.formUser.value).then(r => {
        this.toastr.success("Seus dados foram atualizados!", "Sucesso");
        let user = this.formUser.value;
        user["authority"] = this.auth.getuser()["authority"].toUpperCase()
        this.auth.setUser(user);
      });
    }

    ngOnInit() {
      this.formUser = this.getFb();
      this.formUser.get("authority").disable();
      this.getIndicate();
      this.changeLeft();
      
    }

    getIndicate () {
      if (this.auth.getuser()["indicate"]) {
        this.restService.callApi("getIndicateUser", null, [this.auth.getuser()["indicate"]*1]).then(r => {
          if (r["body"]) {
            this.mountIndicate(r);
          }
        });
      }
    }

    mountIndicate(r) {
      this.userIndicate.present = true;
      this.formIndicate = this.fb.group({
        id: [r["body"]["id"]],
        email: [r["body"]["email"]],
        name: [r["body"]["name"]],
        cel: [r["body"]["cel"]]
      });
      this.formIndicate.get("name").disable();
      this.formIndicate.get("email").disable();
      this.formIndicate.get("cel").disable();
    }

    getFb() {
      return this.fb.group({
        id: [this.auth.getuser()["id"]],
        email: [this.auth.getuser()["email"], [Validators.required, Validators.email]],
        name: [this.auth.getuser()["name"], [Validators.required]],
        cel: [this.auth.getuser()["cel"]],
        wallet: [this.auth.getuser()["wallet"]],
        authority: [this.auth.getuser()["authority"].toUpperCase()],
        photo: [this.auth.getuser()["photo"]],
        available: [true],
        indicate: [this.auth.getuser()["indicate"]]
      });
    }

    confirm(content) {
      if (this.formUser.invalid) {
        this.toastr.info("Preencha os campos obrigatórios antes de prosseguir.", "Atenção");
        return;
      }
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then((result) => {
        this.submit();
      }, (e) => {});
    }
    
}
