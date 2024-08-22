import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionHomeComponent } from './admission-home.component';

describe('AdmissionHomeComponent', () => {
  let component: AdmissionHomeComponent;
  let fixture: ComponentFixture<AdmissionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
