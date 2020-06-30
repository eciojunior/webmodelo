import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStoreService } from "./local-store.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class RestService {

    constructor(private http:HttpClient, private store: LocalStoreService, private toastr: ToastrService, private router: Router) {}

    private requests = {
        login: {
            url: "login/simple",
            method: "post"
        },
        getUser: {
            url: "login/user/##",
            method: "get"
        },
        getAllPartners: {
            url: "partner/all",
            method: "get"
        },
        getDefaultUserCashback: {
            url: "user/cashback/default",
            method: "get"
        },
        registerUser: {
            url: "user/register",
            method: "post"
        },
        changePassword: {
            url: "user/password/change",
            method: "post"
        },
        getAllUser: {
            url: "user/all",
            method: "get"
        },
        userChangeAuthority: {
            url: "user/authority/change/##",
            method: "get"
        },
        updateUser: {
            url: "user/update",
            method: "post"
        },
        getIndicateUser: {
            url: "user/indicate/##",
            method: "get"
        },
        getNotificationUser: {
            url: "user/notification",
            method: "get"
        },
        userReadNotification: {
            url: "user/notification/read/##",
            method: "get"
        }
    }
    
    callApi(api, body?, urlParams?, personalHeaders?) {
        let request = this.requests[api];
        if (!request) {
            this.toastr.error("Serviço não mapeado, entre em contato com o desenvolvedor.")
            return;
        }
        let url = this.getUrl(request, body, urlParams);
        let headers = this.getHeaders(personalHeaders);
        return this.callMethod(request.method, url, body, headers);
    }

    private callMethod (method, url, body?, headers?) {
        return new Promise((resolve, reject) => {
            switch(method) {
                case "get": case "delete": {
                    this.http[method](url, headers).subscribe(data => { resolve(data) }, error => {
                        this.resolveError(error);
                        reject(error);
                    });
                    break;
                }
                case "post": case "put": {
                    this.http[method](url, body, headers).subscribe(data => { resolve(data) }, error => {
                        this.resolveError(error);
                        reject(error);
                    });
                    break;
                }
            }
        })
    }

    private resolveError (response) {
        if (response.status == 401) {
            this.store.setItem("auth_user", null);
            this.store.setItem("user", null);
            this.toastr.info("Sua sessão expirou!", "Olá");
            this.router.navigateByUrl("/");
            return false;
        }
        this.toastr.error(response.error["message"], "Atenção!");
    }

    private getHeaders (personalHeaders) {
        personalHeaders = personalHeaders || {};
        let authorization = this.store.getItem("auth_user"); 
        let defaultHeaders = authorization ?  {'Authorization': authorization}: {};
        return {
            observe: 'response',
            headers: new HttpHeaders(Object.assign(defaultHeaders, personalHeaders))
        }
    }

    private getUrl(request, body?, urlParams?) {
        let url = environment.urlBack + request["url"];
        if (Array.isArray(urlParams) && urlParams.length > 0) {
            urlParams.forEach(p => {
                url = url.replace("##", p);
            })
        }
        if (["get", "delete"].includes(request.method) && body != null) {
            url = url + "?";
            let params = [];
            Object.keys(body).forEach(p => {
                params.push(p + "=" + body[p]);
            });
            url = url + params.join("&");
        }
        return url;
    }
}
