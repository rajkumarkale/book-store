import {Injectable} from '@angular/core';
import {default as BookList} from '../../../assets/data/books.json';
import {BookCardInterface} from '../../book-card/book-card.interface';
import * as _ from 'lodash';
import {CountComparator} from '../../side-bar/side-bar.enum';
import {Subject} from 'rxjs';

export interface IBookFilter {
  bookNames?: Array<string>;
  authorNames?: Array<string>;
  maxPageCount?: number;
  comparator?: string;
  searchKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BooksSearchService {

  public booksObservable = new Subject();

  constructor() {
  }

  getBooks(): Promise<BookCardInterface[]> {
    return new Promise(resolve => {
      resolve(_.get(BookList, 'books', []));
    });
  }

  filteredBooks(filter?: IBookFilter): Promise<BookCardInterface[]> {
    return new Promise(resolve => {
      if (!_.isEmpty(filter.searchKey)) {
        resolve(this.searchBookByWord(BookList, filter.searchKey));
      } else {
        resolve(this.searchBookByCategory(filter));
      }
    });
  }

  setFilterParams(filter) {
    this.booksObservable.next(filter);
  }

  getFilterParams() {
    return this.booksObservable.asObservable();
  }

  /**
   * Search the book list based on criteria search book name, author name, etc
   * @param filter
   */
  searchBookByCategory(filter?: IBookFilter) {
    return _.filter(_.get(BookList, 'books', []), book => {
      if (!_.isEmpty(filter.authorNames) || !_.isEmpty(filter.bookNames) || (filter.maxPageCount && !_.isEmpty(filter.comparator))) {
        const isBookNameMatched = _.find(filter.bookNames, authorName => _.isEqual(authorName.toLowerCase(), book.bookName.toLowerCase()));
        const isAuthorNameMatched = _.find(filter.authorNames, authorName => _.isEqual(book.authorName.toLowerCase(), authorName.toLowerCase()));
        let pageCountMatched = false;

        if (filter.comparator === CountComparator.EQUAL) {
          pageCountMatched = book.pageCount === filter.maxPageCount;
        }

        if (filter.comparator === CountComparator.LESS) {
          pageCountMatched = book.pageCount < filter.maxPageCount;
        }

        if (filter.comparator === CountComparator.GREATER) {
          pageCountMatched = book.pageCount > filter.maxPageCount;
        }
        return isBookNameMatched || isAuthorNameMatched || pageCountMatched;
      }
      return book;
    });
  }

  /**
   * Search book list based on words, match the word in list and return the list
   * @param bookList
   * @param searchKey
   */
  searchBookByWord(bookList, searchKey) {
    return _.filter(_.get(bookList, 'books', []), book => {
      const searchWord = searchKey.toLowerCase();
      const bookNameMatched = book.bookName.toLowerCase().startsWith(searchWord);
      const authorNameMatched = book.authorName.toLowerCase().startsWith(searchWord);
      const publishDateMatched = book.publishDate.toLowerCase().startsWith(searchWord);
      const pageCountMatched = String(book.pageCount).toLowerCase().startsWith(searchWord);

      return bookNameMatched || authorNameMatched || publishDateMatched || pageCountMatched;
    });
  }
}
