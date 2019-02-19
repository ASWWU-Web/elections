import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPositionHandlerComponent } from './multi-position-handler.component';

describe('MultiPositionHandlerComponent', () => {
  let component: MultiPositionHandlerComponent;
  let fixture: ComponentFixture<MultiPositionHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiPositionHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPositionHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
