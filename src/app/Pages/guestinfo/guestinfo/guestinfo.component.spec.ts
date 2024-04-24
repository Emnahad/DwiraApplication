import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestinfoComponent } from './guestinfo.component';

describe('GuestinfoComponent', () => {
  let component: GuestinfoComponent;
  let fixture: ComponentFixture<GuestinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestinfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuestinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
