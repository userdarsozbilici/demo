import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissonTableComponent } from './admission-table.component';

describe('AdmissonTableComponent', () => {
  let component: AdmissonTableComponent;
  let fixture: ComponentFixture<AdmissonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissonTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
