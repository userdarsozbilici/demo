import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionMainComponent } from './admission-main.component';

describe('MainComponent', () => {
  let component: AdmissionMainComponent;
  let fixture: ComponentFixture<AdmissionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
