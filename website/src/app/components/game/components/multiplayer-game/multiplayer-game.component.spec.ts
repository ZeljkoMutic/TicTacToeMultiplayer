import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerGameComponent } from './multiplayer-game.component';

describe('MultiplayerGameComponent', () => {
  let component: MultiplayerGameComponent;
  let fixture: ComponentFixture<MultiplayerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplayerGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiplayerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
