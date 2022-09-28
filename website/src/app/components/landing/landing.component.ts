import {Component, OnInit} from '@angular/core';
import {StateService} from "../../services/state/state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(
    public state: StateService,
    public router: Router
  ) {

  }


  ngOnInit(): void {
    console.log(1);
  }

  play(mode: 'singleplayer' | 'multiplayer') {
    this.state.mode = mode;
    this.router.navigate(['/game'])

  }
}
