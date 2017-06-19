import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";

@Component({
  selector: 'xiaoyuyue-booking-about',
  templateUrl: './booking-about.component.html',
  styleUrls: ['./booking-about.component.scss'],
  animations: [appModuleAnimation()]
})
export class BookingAboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
