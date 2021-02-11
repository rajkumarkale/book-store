import {Component, Input, OnInit} from '@angular/core';
import {BookCardInterface} from './book-card.interface';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit {

  @Input() bookDetails: BookCardInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
