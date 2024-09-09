import { Component, NgModule, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-success',
  templateUrl: './verify-success.component.html',
  styleUrls: ['./verify-success.component.scss'],
})
export class VerifySuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  goToHome() {
    this.router.navigate(['/']);
  }
}
