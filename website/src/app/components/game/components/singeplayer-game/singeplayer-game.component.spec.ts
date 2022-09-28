import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingeplayerGameComponent } from './singeplayer-game.component';

describe('SingeplayerGameComponent', () => {
  let component: SingeplayerGameComponent;
  let fixture: ComponentFixture<SingeplayerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingeplayerGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingeplayerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
