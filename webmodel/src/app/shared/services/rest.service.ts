import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStoreService } from "./local-store.service";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class RestService {

    constructor(private http:HttpClient, private store: LocalStoreService, private toastr: ToastrService) {}

    private requests = {
        login: {
            url: "login/simple",
            method: "post"
        },
        getUser: {
            url: "login/user/##",
            method: "get"
        }
    }
    
    callApi(api, body?, urlParams?, personalHeaders?) {
        let request = this.requests[api];
        if (!request) {
            this.toastr.error("Serviço não mapeado, entre em contato com o desenvolvedor.")
            return;
        }
        let url = this.getUrl(request, urlParams);
        let headers = this.getHeaders(personalHeaders);
        return this.callMethod(request.method, url, body, headers);
    }

    private callMethod (method, url, body?, headers?) {
        return new Promise((resolve, reject) => {
            switch(method) {
                case "get": {
                    this.http.get(url, headers).subscribe(data => { resolve(data) }, error => {
                        this.resolveError(error);
                        reject(error);
                    });
                    break;
                }
                case "post": {
                    this.http.post(url, body, headers).subscribe(data => { resolve(data) }, error => {
                        this.resolveError(error);
                        reject(error);
                    });
                    break;
                }
                case "put": {
                    this.http.put(url, body, headers).subscribe(data => { resolve(data) }, error => {
                        this.resolveError(error);
                        reject(error);
                    });
                    break;
                }
                case "delete": {
                    this.http.delete(url, headers).subscribe(data => { resolve(data) }, error => {
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
            this.toastr.info("Sua sessão expirou, entre novamente!", "Olá");
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

    private getUrl(request, urlParams) {
        let url = environment.urlBack + request["url"];
        if (Array.isArray(urlParams) && urlParams.length > 0) {
            urlParams.forEach(p => {
                url = url.replace("##", p);
            })
        }
        return url;
    }
}
