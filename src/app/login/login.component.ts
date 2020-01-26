import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password : string;
  errorMessage = 'Name/Password nicht korrekt';
  successMessage: string;
  invalidLogin = false;
  loginSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {   }

  ngOnInit() {
  }

  handleLogin() {
    this.authenticationService.authenticationService(this.username, this.password).subscribe((result)=> {
      this.invalidLogin = false;
      this.loginSuccess = true;
      this.successMessage = 'Login Successful.';
      
      var token = this.username;
      var token2 = this.password;
      localStorage.setItem("token", token);
      localStorage.setItem("token2", token2);
      this.router.navigate(['/AdminDashboard']);
    }, () => {
      this.invalidLogin = true;
      this.loginSuccess = false;
    });   
    
    this.invalidLogin = true;
    this.loginSuccess = false;
  }
}
