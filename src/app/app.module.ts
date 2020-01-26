import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { NgbdModalBasic } from './admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpRequestService } from './http-request.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



//import { HelloWorldComponent } from './hello-world/hello-world.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';

import { LogoutComponent } from './logout/logout.component';
import { HttpInterceptorService } from './httpInterceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



const appRoutes: Routes = [
  {path:'AdminDashboard', component:AdminDashboardComponent},

  {path: 'login', component: LoginComponent},
  {path: '', component: LoginComponent},
  //{path: 'hello-world', component: HelloWorldComponent},
  {path: 'logout', component: LoginComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,

    //HelloWorldComponent,
    MenuComponent,
    LoginComponent,
    LogoutComponent
    

  ],



  imports: [

    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    
  ],
  providers: [HttpRequestService, AdminDashboardComponent,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],

  bootstrap: [
    AppComponent,
  ],
  entryComponents: []
 
})

export class AppModule { }

export class NgbdModalBasicModule {}
