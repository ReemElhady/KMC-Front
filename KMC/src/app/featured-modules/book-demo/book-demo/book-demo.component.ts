import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemoBookingService } from '../../../@shared/services/demo-booking.service';
import { Router } from '@angular/router';
import { imgUrl } from '../../../@shared/http/http.service';

@Component({
  selector: 'app-book-demo',
  templateUrl: './book-demo.component.html',
  styleUrls: ['./book-demo.component.scss']
})
export class BookDemoComponent implements OnInit {
  demoForm!: FormGroup;
  pageContent: any = null;
  imgUrl = imgUrl;

  constructor(private fb: FormBuilder, private demoBookingService: DemoBookingService, private router: Router ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPageContent();
  }

  initForm(): void {
    this.demoForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      device_name: ['', [Validators.required, Validators.maxLength(250)]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
    });
  }

  loadPageContent(): void {
    this.demoBookingService.getBookDemoPageContent().subscribe({
      next: (response) => {
        console.log(response)
        this.pageContent = response;
      },
      error: (err) => {
        console.error('Error loading page content', err);
      },
    });
  }
  getBackgroundImage(): string {
    if (!this.pageContent) {
      return '';
    }
    return window.innerWidth > 768 ? this.pageContent.image : this.pageContent.mobile_view_media;
  }

  onSubmit(): void {
    if (this.demoForm.valid) {
      this.demoBookingService.bookDemo(this.demoForm.value).subscribe({
        next: (response) => {
          alert(response.message || 'Booking successful!');
          this.demoForm.reset();
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Error submitting form', err);
          alert('There was an error submitting the form.');
        },
      });
    }
  }
}
