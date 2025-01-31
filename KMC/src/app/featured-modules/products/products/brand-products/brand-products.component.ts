import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/@shared/http/http.service';

@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.component.html',
  styleUrls: ['./brand-products.component.scss']
})
export class BrandProductsComponent implements OnInit {
  // brandId!: number;
  id!: number; // ID of the brand or branch
  type!: 'brand' | 'branch'; // Type to differentiate between brand and branch
  products: any[] = [];
  isLoading: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Determine the type (brand or branch) based on route params
      if (params['brandId']) {
        this.type = 'brand';
        this.id = +params['brandId'];
      } else if (params['branchId']) {
        this.type = 'branch';
        this.id = +params['branchId'];
      }

      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    const endpoint =
      this.type === 'brand'
        ? `api/product/by-brand/${this.id}`
        : `api/product/by-branch/${this.id}`;

    this.http.getReq(endpoint).subscribe(
      (data: any[]) => {
        this.products = data;
        this.isLoading = false;
        console.log(`${this.type} products:`, this.products);
      },
      (error) => {
        console.error(`Error fetching ${this.type} products:`, error);
        this.isLoading = false;
      }
    );
  }
  

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.brandId = +params['brandId'];
  //     this.fetchProducts();
  //   });
  // }

  // fetchProducts(): void {
  //   this.http.getReq(`api/product/by-brand/${this.brandId}`).subscribe(
  //     (data: any[]) => {
  //       this.products = data;
  //       this.isLoading = false;
  //       console.log("products results", this.products)
  //     },
  //     (error) => {
  //       console.error('Error fetching products:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }
}
