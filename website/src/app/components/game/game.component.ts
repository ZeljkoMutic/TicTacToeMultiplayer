import {Component} from '@angular/core';
import {StateService} from "../../services/state/state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor(
    public state: StateService,
    public router: Router
  ) {
    if(!this.state.mode){
      this.router.navigate(['/']);
    }
  }
}
