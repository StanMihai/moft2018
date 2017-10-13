import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

  public muzee: number;
  public bilete: number;
  public teatru: number;
  public film: number;

  constructor() { }

  ngOnInit() {}

}
