import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookCardInterface} from '../book-card/book-card.interface';
import {default as Books} from '../../assets/data/books.json';
import {BooksSearchService, IBookFilter} from '../shared/services/books-search.service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-book-container',
  templateUrl: './book-container.component.html',
  styleUrls: ['./book-container.component.css']
})
export class BookContainerComponent implements OnInit, OnDestroy {

  public bookList: BookCardInterface[] = [];
  public bookSubscription: Subscription;

  constructor(private booksSearchService: BooksSearchService) {
  }

  ngOnInit(): void {
    this.getBooks();

    this.bookSubscription = this.booksSearchService.getFilterParams()
      .subscribe(params => {
        this.getBooks(params);
      });
  }

  /**
   * Get the books based filter
   * @param filterParams: IBookFilter
   */
  getBooks(filterParams: IBookFilter = {}) {
    this.booksSearchService.filteredBooks(filterParams)
      .then(result => {
        this.bookList = result;
      })
      .catch(error => {
        console.error(`Unable to get data`, error);
      });
  }

  /**
   * Remove all subscription to avoid any emory leak and performance issue
   */
  ngOnDestroy() {
    if (this.bookSubscription) {
      this.bookSubscription.unsubscribe();
    }
  }
}
