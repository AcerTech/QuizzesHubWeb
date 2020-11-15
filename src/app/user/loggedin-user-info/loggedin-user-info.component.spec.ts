import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedinUserInfoComponent } from './loggedin-user-info.component';

describe('LoggedinUserInfoComponent', () => {
  let component: LoggedinUserInfoComponent;
  let fixture: ComponentFixture<LoggedinUserInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedinUserInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedinUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
