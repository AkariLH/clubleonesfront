import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationRegistrationComponent } from './administration-registration.component';

describe('AdministrationRegistrationComponent', () => {
  let component: AdministrationRegistrationComponent;
  let fixture: ComponentFixture<AdministrationRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrationRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
