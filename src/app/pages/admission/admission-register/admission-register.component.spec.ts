import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionRegisterComponent } from './admission-register.component';

describe('AdmissionRegisterComponent', () => {
  let component: AdmissionRegisterComponent;
  let fixture: ComponentFixture<AdmissionRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
