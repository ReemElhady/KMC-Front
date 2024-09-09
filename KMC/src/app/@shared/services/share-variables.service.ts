import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareVariablesService {
  private Source = new BehaviorSubject({ img: '', phone: '', qrCodeLink: '' });
  currentSource = this.Source.asObservable();
  setImg(img: string) {
    this.Source.next({ ...this.Source.value, img });
  }
  setPhone(phone: string) {
    this.Source.next({ ...this.Source.value, phone });
  }
  setLink(qrCodeLink: string) {
    this.Source.next({ ...this.Source.value, qrCodeLink });
  }
  constructor() {}
}
