import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteFormComponent } from './vote-form.component';

describe('VoteFormComponent', () => {
  let component: VoteFormComponent;
  let fixture: ComponentFixture<VoteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
