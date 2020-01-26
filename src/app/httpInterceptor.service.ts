import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from './login/auth.service';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) { }



    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authenticationService.isUserLoggedIn() && req.url.indexOf('basicauth') === -1) {
            var t1 = localStorage.getItem("token"); 
            var t2 = localStorage.getItem("token2"); 
            const authReq = req.clone({
                headers: new HttpHeaders({
                   authorization: this.authenticationService.createBasicAuthToken(t1, t2)
                   // 'Content-Type': 'application/json;charset=UTF-8',
                   // 'Authorization': `Basic ${window.btoa(this.authenticationService.username + ":" + this.authenticationService.password)}`,
                   // 'Authorization': `Basic ${window.btoa(t1 + ":" + t2)}`,
                   // 'Access-Control-Allow-Origin' : origin,
                    //'Access-Control-Allow-Credentials': 'true',
                   // 'X-Requested-With' : 'true',
                   // 'XMLHttpRequest' : 'true'
                })
              
            });
            console.log(authReq.headers);
            console.log("Name: " + t1 + ":" + t2);
            return next.handle(authReq).pipe(

                catchError((err: HttpErrorResponse) => {
                  if (err.status == 401) {
                    
                    console.log(authReq.headers);
                    console.log("Name: " + this.authenticationService.username + ":" + this.authenticationService.password);
                    console.log("Hier der tolle 2te 401 Fehler!!!!" + this.authenticationService.isUserLoggedIn() +" || " + req.url.indexOf('basicauth'))
                    return next.handle(req);

                  } else {
                    return throwError(err);
                  }
                })
              );
        } else {

          console.log("HIER");
            return next.handle(req).pipe(
                  
                catchError((err: HttpErrorResponse) => {
                  if (err.status == 401) {
                    console.log("Hier der tolle 401 Fehler!!!!" + this.authenticationService.isUserLoggedIn() +" || " + req.url.indexOf('basicauth'))
                  } else {
                    return throwError(err);
                  }
                })
              );

        }
    }
}