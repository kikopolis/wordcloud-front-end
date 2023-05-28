import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendformComponent } from './sendform.component';

describe('SendformComponent', () => {
  let component: SendformComponent;
  let fixture: ComponentFixture<SendformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
