import { Injectable } from '@angular/core';
import {random} from "@jaspero/utils";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(

  ) {
    this.userId = localStorage.getItem('userId') || random.string(8);
    console.log(this.userId);
    localStorage.setItem('userId', this.userId);
  }

  mode: 'singleplayer' | 'multiplayer';
  endgame_mode: 'home' | 'leaderboard';
  userId: string;
}
