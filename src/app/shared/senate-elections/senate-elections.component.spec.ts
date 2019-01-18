import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenateElectionsComponent } from './senate-elections.component';

describe('SenateElectionsComponent', () => {
  let component: SenateElectionsComponent;
  let fixture: ComponentFixture<SenateElectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenateElectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenateElectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
