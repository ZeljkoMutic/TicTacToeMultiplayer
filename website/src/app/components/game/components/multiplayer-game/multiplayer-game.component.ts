import {Component, OnInit} from '@angular/core';
import {StateService} from "../../../../services/state/state.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ResultDialogComponent} from "../../../result-dialog/result-dialog.component";


@Component({
  selector: 'app-multiplayer-game',
  templateUrl: './multiplayer-game.component.html',
  styleUrls: ['./multiplayer-game.component.scss']
})
export class MultiplayerGameComponent implements OnInit {

  ready = false;
  preparing = false;
  symbol: string;
  myTurn = false;
  gameId: string;
  gameClosed = false;
  ws: WebSocket;
  board = [['', '', ''],
    ['', '', ''],
    ['', '', '']];
  currentPlayer: 'X' | 'O' = null;
  otherPlayer: 'X' | 'O' = null;
  turn = false;

  constructor(
    public state: StateService,
    public router: Router,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    console.log(this.state.mode);
    if (this.state.mode === undefined) {
      this.router.navigate(['/']);
      console.log('Gamemode not defined');
    }
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "setup",
        payload: {
          userId: this.state.userId
        }
      }));
    };


    this.ws.onmessage = (message: any) => {
      const data = JSON.parse(message.data);
      if (data.type === 'ready') {
        this.ready = true;
        this.preparing = true;
        this.symbol = data.payload.symbol;
        this.myTurn = data.payload.myTurn;
        this.gameId = data.payload.gameId;
        setTimeout(() => {
          this.preparing = false;
        }, 1500)
      }
      if (data.type === 'move') {
        this.myTurn = true;
        this.board = data.payload.board;
        let result = this.checkWinner();
        if (result !== null) {
          console.log("Win");
          this.openDialog();
        }
      }
      if (data.type === 'close') {
        this.gameClosed = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 5000)
      }

      if (data.type === 'rematch') {
        const accept = confirm('Opponent would like a rematch');
        this.ws.send(JSON.stringify({
          type: 'rematch-response',
          payload:{
            accept,
            gameId: this.gameId,
            symbol: this.symbol
          }
        }))
      }

      if(data.type === 'rematch-response'){
        alert('Opponent said: ' + data.payload.accept);
      }
      console.log(data);
    }

  }

  openField(index_i: number, index_j: number) {


    if (this.board[index_i][index_j]) {
      return;
    }
    if (!this.myTurn) {
      return;
    }
    this.board[index_i][index_j] = this.symbol;
    this.ws.send(JSON.stringify({
      type: 'move',
      payload: {
        i: index_i,
        j: index_j,
        gameId: this.gameId,
        symbol: this.symbol,
      }
    }))
    this.myTurn = false;

    let result = this.checkWinner();
    if (result !== null) {
      console.log("Win");
      this.openDialog();
      this.ws.send(JSON.stringify({
        type: 'finish',
        payload: {
          gameId: this.gameId
        }
      }))
    }


  }


  openDialog(): void {

    this.dialog.open(ResultDialogComponent, {
      width: '250px',
      data: {
        winner: this.checkWinner(),
        gameId: this.gameId,
        symbol: this.symbol,
        ws: this.ws
      }
    })
  }

  equals3(a: string, b: any, c: any) {
    return a == b && b == c && a != '';
  }

  checkWinner() {
    let winner = null;

    // horizontal
    for (let i = 0; i < this.board.length; i++) {
      if (this.equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
        winner = this.board[i][0];
      }
    }

    // Vertical
    for (let i = 0; i < this.board.length; i++) {
      if (this.equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
        winner = this.board[0][i];
      }
    }

    // Diagonal
    if (this.equals3(this.board[0][0], this.board[1][1], this.board[2][2])) {
      winner = this.board[0][0];
    }
    if (this.equals3(this.board[2][0], this.board[1][1], this.board[0][2])) {
      winner = this.board[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == '') {
          openSpots++;
        }
      }
    }

    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }

}
