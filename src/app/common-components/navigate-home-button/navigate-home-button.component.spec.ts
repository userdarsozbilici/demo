import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigateHomeButtonComponent } from './navigate-home-button.component';

describe('NavigateHomeButtonComponent', () => {
  let component: NavigateHomeButtonComponent;
  let fixture: ComponentFixture<NavigateHomeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigateHomeButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigateHomeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
