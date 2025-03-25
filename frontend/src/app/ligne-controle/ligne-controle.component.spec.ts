import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneControleComponent } from './ligne-controle.component';

describe('LigneControleComponent', () => {
  let component: LigneControleComponent;
  let fixture: ComponentFixture<LigneControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LigneControleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigneControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
