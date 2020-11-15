import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchImageModelComponent } from './search-image-model.component';

describe('SearchImageModelComponent', () => {
  let component: SearchImageModelComponent;
  let fixture: ComponentFixture<SearchImageModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchImageModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchImageModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
