import {Component, OnInit} from '@angular/core';
import {default as Books} from '../../assets/data/books.json';
import {BookCardInterface} from '../book-card/book-card.interface';
import * as _ from 'lodash';
import {BooksSearchService, IBookFilter} from '../shared/services/books-search.service';
import {CountComparator} from './side-bar.enum';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  public bookList: BookCardInterface[] = [];
  public comparators: string[] = [CountComparator.EQUAL, CountComparator.LESS, CountComparator.GREATER];
  public authorList: BookCardInterface[] = [];
  public bookNameList: BookCardInterface[] = [];

  public filterParams: IBookFilter = {};
  public searchText: string;
  public comparator: string;
  public pageCount: number;

  constructor(private booksSearchService: BooksSearchService) {
  }

  ngOnInit(): void {
    this.getBooks();
  }

  /**
   * Get the book list to make different filters options to filter the list
   */
  getBooks() {
    this.booksSearchService.getBooks()
      .then(result => {
        this.bookList = result;
        this.authorNames();
        this.getBookNames();
      })
      .catch(error => {
        console.error(`Unable to get data`, error);
      });
  }

  /**
   * Calculate the max page count and return so that user will get the max number
   */
  get maxPageCount() {
    return Math.max.apply(Math, this.bookList.map((book) => book.pageCount));
  }

  /**
   * Get all the book authors names and filter only unique so a unique filter can be applied
   */
  public authorNames = (): void => {
    this.authorList = _.uniqBy(_.clone(this.bookList), (book) => book.authorName);
    _.each(this.authorList, book => {
      book.isAuthorSelected = false;
    });
  };

  /**
   * Get all the book names and filter only those books which are not duplicated
   */
  public getBookNames = (): void => {
    this.bookNameList = _.uniqBy(_.clone(this.bookList), (book) => book.bookName);
    _.each(this.bookNameList, name => {
      name.isNameSelected = false;
    });
  };

  /**
   * Update the filter to search and filter the book list and fire a subscription event with updated filters
   */
  public updateFilter() {
    this.resetSearch();
    this.filterParams.searchKey = '';
    this.filterParams.authorNames = _.map(_.filter(this.authorList, author => author.isAuthorSelected), 'authorName');
    this.filterParams.bookNames = _.map(_.filter(this.bookNameList, book => book.isNameSelected), 'bookName');

    if (!_.isEmpty(this.comparator) && _.isNumber(this.pageCount)) {
      this.filterParams.comparator = this.comparator;
      this.filterParams.maxPageCount = this.pageCount;
    }

    this.booksSearchService.setFilterParams(this.filterParams);
  }


  /**
   * Reset all filter once user click on word search box
   */
  public resetAllFilter() {
    this.bookList = [];
    this.filterParams = {};
    this.authorList = [];
    this.bookNameList = [];
    this.getBooks();
    this.booksSearchService.setFilterParams(this.filterParams);
  }

  /**
   * Reset Search
   */
  resetSearch() {
    this.searchText = '';
  }

  /**
   * Search and filter book list based on key
   * @param searchKey: string
   */
  searchBooksWithWords(searchKey: string) {
    this.filterParams.searchKey = searchKey;
    this.booksSearchService.setFilterParams(this.filterParams);
  }
}
