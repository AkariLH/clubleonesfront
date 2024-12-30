import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTypeComponent } from './add-event-type.component';

describe('AddEventTypeComponent', () => {
  let component: AddEventTypeComponent;
  let fixture: ComponentFixture<AddEventTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
