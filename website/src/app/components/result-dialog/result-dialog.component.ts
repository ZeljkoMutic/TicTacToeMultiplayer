import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {StateService} from "../../services/state/state.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public state: StateService,
    public router: Router,
    private dialogRef: MatDialogRef<ResultDialogComponent>
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    setTimeout(()=>{
      this.closeDialog();
      this.router.navigate(['/']);
    }, 5*60*1000);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  choose(endgame_mode: 'home' | 'leaderboard') {
    this.state.endgame_mode = endgame_mode;
    if (endgame_mode === 'home') {
      this.router.navigate(['/'])
      this.closeDialog();
    }
    if (endgame_mode === 'leaderboard') {
      this.router.navigate(['/'])
      this.closeDialog();
    }
  }

  rematch() {

    this.data.ws.send(JSON.stringify({
      type: 'rematch',
      payload: {
        gameId: this.data.gameId,
        symbol: this.data.symbol
      }
    }))
    console.log(this.data);
  }
}
