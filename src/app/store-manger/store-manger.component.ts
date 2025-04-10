import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-store-manger',
  imports: [],
  templateUrl: './store-manger.component.html',
  styleUrl: './store-manger.component.scss',
})
export class StoreMangerComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
}
