import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { StoreMangerComponent } from './store-manger/store-manger.component';

@Component({
  selector: 'app-root',
  imports: [StoreMangerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'crud-angular';

  ngOnInit(): void {
    initFlowbite();
  }
}
