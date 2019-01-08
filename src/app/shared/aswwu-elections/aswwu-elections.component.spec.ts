import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AswwuElectionsComponent } from './aswwu-elections.component';

describe('AswwuElectionsComponent', () => {
  let component: AswwuElectionsComponent;
  let fixture: ComponentFixture<AswwuElectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AswwuElectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AswwuElectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
