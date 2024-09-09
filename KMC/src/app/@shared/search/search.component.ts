import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/products.models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  allData: Product | null = null;
  isLoading: boolean = false;
  noRes: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters and perform search
    this.route.params.subscribe(params => {
      const searchText = params['searched'];
      this.search(searchText);
    });
  }

  search(query: string): void {
    if (!query.trim()) {
      this.allData = null;
      this.noRes = false;
      return;
    }

    this.isLoading = true;
    this.productService.getProduct(`api/product?title=${query}`).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.allData = res;
        this.noRes = !Object.keys(res.results).length;
      },
      error => {
        this.isLoading = false;
        this.noRes = false;
      }
    );
  }
}

