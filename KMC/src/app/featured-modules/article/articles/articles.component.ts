import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from 'src/app/@shared/http/http.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Articles } from '../../../models/article-model';
import { ArticleAction } from 'src/app/store/articles/article-action';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private unSubscribe!: Subscription;
  articleContent!: Articles;
  isMobile: boolean = false;
  constructor(
    private store: Store<{ article: Articles }>,
    private http: HttpService
  ) {
    if (window.innerWidth < 767) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngOnInit(): void {
    this.getAllData();
  }
  
  // getAllData() {
  //   this.isLoading = false;
  //   this.store.select('article').subscribe((article) => {
  //     this.articleContent = article;
  //     if (!this.articleContent) {
  //       this.isLoading = true;
  //       this.unSubscribe = this.http
  //         .getReq('api/article/')
  //         .subscribe((res: Articles) => {
  //           this.store.dispatch(new ArticleAction(res));
  //           this.isLoading = false;
  //         });
  //     }
  //   });
  // }

  getAllData() {
    this.isLoading = false;
    this.store.select('article').subscribe((article) => {
      this.articleContent = article;
  
      if (!this.articleContent) {
        this.isLoading = true;
        this.unSubscribe = this.http.getReq('api/article/').subscribe((res: Articles) => {
          // Check if results exist and sort them
          if (res && res.results) {
            // Parse and sort by created_at manually
            res.results.sort((a, b) => {
              const dateA = this.parseCustomDate(a.created_at);
              const dateB = this.parseCustomDate(b.created_at);
              return dateB.getTime() - dateA.getTime();
            });
          }
  
          // Dispatch sorted data
          this.store.dispatch(new ArticleAction(res));
          this.isLoading = false;
        });
      }
    });
  }
  
  // Helper function to parse non-standard date formats like "1\nSep"
  parseCustomDate(dateString: string): Date {
    try {
      // Clean up the date string by removing any newlines and extra spaces
      const cleanedDate = dateString.replace(/\n/g, ' ').trim();
  
      // Extract day and month (assuming format is something like "1 Sep")
      const [day, month] = cleanedDate.split(' ');
  
      // Define a map of month abbreviations to numbers (optional if needed)
      const monthMap: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
  
      // Ensure the parsed day is a valid number
      const dayNumber = parseInt(day, 10);
  
      if (isNaN(dayNumber) || !monthMap[month]) {
        console.warn('Invalid date format:', dateString);
        return new Date(); // Return current date as a fallback
      }
  
      // Assume the current year for simplicity, or update this logic if year is present
      const year = new Date().getFullYear();
  
      // Create and return a valid Date object
      return new Date(year, monthMap[month], dayNumber);
  
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return new Date(); // Return current date if parsing fails
    }
  }
  


  ngOnDestroy(): void {
    if (this.unSubscribe) {
      this.unSubscribe.unsubscribe();
    }
  }
}
