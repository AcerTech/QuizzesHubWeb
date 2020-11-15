import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerEntryComponent } from './answer-entry.component';

describe('AnswerEntryComponent', () => {
  let component: AnswerEntryComponent;
  let fixture: ComponentFixture<AnswerEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
