import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanControlesComponent } from './plan-controles.component';

describe('PlanControlesComponent', () => {
  let component: PlanControlesComponent;
  let fixture: ComponentFixture<PlanControlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanControlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
