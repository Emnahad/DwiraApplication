import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviesComponent } from './envies.component';

describe('EnviesComponent', () => {
  let component: EnviesComponent;
  let fixture: ComponentFixture<EnviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnviesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
