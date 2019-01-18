import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'slb-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  @Input() name: string;
  @Input() color: string;

  constructor() { }

  ngOnInit() {
  }

}
