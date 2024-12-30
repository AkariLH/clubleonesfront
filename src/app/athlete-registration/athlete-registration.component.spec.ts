import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteRegistrationComponent } from './athlete-registration.component';

describe('AthleteRegistrationComponent', () => {
  let component: AthleteRegistrationComponent;
  let fixture: ComponentFixture<AthleteRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
