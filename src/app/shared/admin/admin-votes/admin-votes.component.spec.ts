import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVotesComponent } from './admin-votes.component';

describe('AdminVotesComponent', () => {
  let component: AdminVotesComponent;
  let fixture: ComponentFixture<AdminVotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
