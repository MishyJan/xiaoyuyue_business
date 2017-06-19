import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { appModuleAnimation } from "shared/animations/routerTransition";

@Component({
  selector: 'xiaoyuyue-booking-time',
  templateUrl: './booking-time.component.html',
  styleUrls: ['./booking-time.component.scss'],
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None
})
export class BookingTimeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.\

    $(".flatpickr").flatpickr({
      inline: true,
      "locale": "zh"
    })
  }

}
