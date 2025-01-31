import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdService } from '../../services/ad.service'; // Import the ad service

import { AdComponent } from './ad.component';

describe('AdComponent', () => {
  let component: AdComponent;
  let fixture: ComponentFixture<AdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
