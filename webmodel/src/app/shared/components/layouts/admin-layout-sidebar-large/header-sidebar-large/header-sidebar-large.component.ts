import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';
import { AuthService } from '../../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utils } from '../../../../utils';
import { RestService } from '../../../../services/rest.service';

@Component({
  selector: 'app-header-sidebar-large',
  templateUrl: './header-sidebar-large.component.html',
  styleUrls: ['./header-sidebar-large.component.scss']
})
export class HeaderSidebarLargeComponent implements OnInit{
  notifications: [];
  login: {};
  signinForm: FormGroup;
  registerForm: FormGroup;
  notificationForm: {};
  changePasswordForm: FormGroup;
  constructor(
    private navService: NavigationService,
    public searchService: SearchService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private rest: RestService,
    private activeRoute: ActivatedRoute
  ) {}

  userData () {
    this.router.navigateByUrl('/user/data');
  }

  ngOnInit () {
    this.notifications = [];
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required],
      indicate: [this.activeRoute.snapshot.queryParamMap.get('userIndicate')]
    }, {
        validator: Utils.MustMatch('password', 'confirmPassword')
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: Utils.MustMatch('password', 'confirmPassword')
    });
    this.getNotification();
  }

  open(content) {
    this.cleanModal();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openNotification (content, data) {
    this.notificationForm = {
      id: data["id"],
      title: data["title"],
      body: data["body"],
      link: data["link"]
    };
    if (!data["read"]) {
      this.rest.callApi("userReadNotification", null, [data["id"]*1]).then(r=>{
        this.open(content);
      })
    }
    else {
      this.open(content);
    }  
  }

  ngIsAuthenticated () {
    return this.auth.isAuthenticated();
  }

  closeSidebar() {
    const state = this.navService.sidebarState;
    state.sidenavOpen = false;
  }

  toggelSidebar() {
    const state = this.navService.sidebarState;
    if (state.childnavOpen && state.sidenavOpen) {
      return state.childnavOpen = false;
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return state.sidenavOpen = false;
    }
    if (!state.sidenavOpen && !state.childnavOpen 
      && this.navService.selectedItem.type === 'dropDown') {
        state.sidenavOpen = true;
        setTimeout(() => {
            state.childnavOpen = true;
        }, 50);
    }
    if (!state.sidenavOpen && !state.childnavOpen) {
      state.sidenavOpen = true;
    }
  }

  private cleanModal () {
    this.signinForm.setValue({
      email: '',
      password: '',
    });
    this.registerForm.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      indicate: this.registerForm.value["indicate"]
    });
    this.changePasswordForm.setValue({
      oldPassword: '',
      password: '',
      confirmPassword: ''
    });
  }
  
  signup() {
    if (!this.registerForm.valid) {
      this.toastr.info("Preecha todos os campos antes de prosseguir!", "Atenção");
      return;
    }
    this.rest.callApi("registerUser", this.registerForm.value).then(r => {
      this.toastr.success("Você foi cadastrado com sucesso!", "Parabens!");
      this.signinForm.setValue({
        email: this.registerForm.value["email"],
        password: this.registerForm.value["password"],
      });
      this.signin();
    });
  }

  signout() {
    this.notifications = [];
    this.auth.signout();
  }

  signin() {
    if (!this.signinForm.valid) {
      this.toastr.info("Preecha todos os campos antes de prosseguir!", "Atenção");
      return;
    }
    this.auth.signin(this.signinForm.value, () => { this.modalService.dismissAll() });
  }

  changePassword() {
    if (!this.changePasswordForm.valid) {
      this.toastr.info("Preecha todos os campos antes de prosseguir!", "Atenção");
      return;
    }
    this.rest.callApi("changePassword", this.changePasswordForm.value).then(() => {
      this.toastr.success("Senha alterada com sucesso!", "Sucesso!");
      this.modalService.dismissAll();
    });
  }

  getNotification() {
    let loop = () => {
      if (this.auth && this.auth.isAuthenticated()) {
        this.rest.callApi("getNotificationUser").then(r => {
          this.notifications = r["body"];
          this.notifications.forEach(n => {
            let extend = this.getNotificationSettings().find(g => { return g.notificationType == n["notificationType"] }) || {};
            n = Object.assign(n, extend);
          });
        }).catch(r => {
          this.notifications = [];
        });
      }
      setTimeout(loop, 15000);
    }
    loop();
  }

  getNotificationSettings() {
    return [
      {
        notificationType: "INDICADO_REGISTRADO",
        link: "/user/data",
        status: "primary",
        icon: "i-Add-User",
        badge: '1'
      }
    ]
  }

}
