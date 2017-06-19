import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";

@Component({
  selector: 'xiaoyuyue-booking-rating',
  templateUrl: './booking-rating.component.html',
  styleUrls: ['./booking-rating.component.scss'],
  animations: [appModuleAnimation()]
})
export class BookingRatingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
