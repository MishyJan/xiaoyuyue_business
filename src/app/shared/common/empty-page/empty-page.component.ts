import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'xiaoyuyue-empty-page',
  templateUrl: './empty-page.component.html',
  styleUrls: ['./empty-page.component.scss']
})
export class EmptyPageComponent implements OnInit {
@Input() data: any;
@Input() text: any;
@Input() height: string = '240px';
  constructor() { }

  ngOnInit() {
  }

}
