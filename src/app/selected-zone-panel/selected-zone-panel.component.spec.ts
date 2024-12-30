import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedZonePanelComponent } from './selected-zone-panel.component';

describe('SelectedZonePanelComponent', () => {
  let component: SelectedZonePanelComponent;
  let fixture: ComponentFixture<SelectedZonePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedZonePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedZonePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
