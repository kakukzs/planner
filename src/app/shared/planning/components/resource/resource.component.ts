import { Component, OnInit, Input } from '@angular/core';
import { Resource } from '../../models/resource.model';

@Component({
    selector: 'slb-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

    @Input() resource: Resource;
    @Input() fieldNames: Partial<Resource>;

    constructor() { }

    ngOnInit() {
    }
}
