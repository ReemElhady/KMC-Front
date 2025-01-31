import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdService } from '../../services/ad.service'; // Import the Ad Service
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit, OnDestroy {
  ads: string[] = [];
  currentAdIndex: number = 0;
  adInterval: any;
  adSubscription!: Subscription;

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    // Fetch ads and start rotation
    this.adSubscription = this.adService.getAds().subscribe((ads) => {
      this.ads = ads;
      this.startAdRotation();
    });
  }

  startAdRotation(): void {
    if (this.ads.length > 0) {
      this.adInterval = setInterval(() => {
        this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
      }, 3000); // Rotate every 3 seconds
    }
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions and intervals
    if (this.adInterval) clearInterval(this.adInterval);
    if (this.adSubscription) this.adSubscription.unsubscribe();
  }
}
