import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDashboardComponent } from './athlete-dashboard.component';

describe('AthleteDashboardComponent', () => {
  let component: AthleteDashboardComponent;
  let fixture: ComponentFixture<AthleteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthleteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthleteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
