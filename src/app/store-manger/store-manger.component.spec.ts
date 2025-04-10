import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreMangerComponent } from './store-manger.component';

describe('StoreMangerComponent', () => {
  let component: StoreMangerComponent;
  let fixture: ComponentFixture<StoreMangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreMangerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreMangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
