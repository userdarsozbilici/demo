import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliclinicHomeComponent } from './policlinic-home.component';

describe('PoliclinicHomeComponent', () => {
  let component: PoliclinicHomeComponent;
  let fixture: ComponentFixture<PoliclinicHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliclinicHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliclinicHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
