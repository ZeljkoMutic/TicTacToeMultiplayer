import { Component, OnInit } from '@angular/core';
import {StateService} from "../../../../services/state/state.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ResultDialogComponent} from "../../../result-dialog/result-dialog.component";

@Component({
  selector: 'app-singeplayer-game',
  templateUrl: './singeplayer-game.component.html',
  styleUrls: ['./singeplayer-game.component.scss']
})
export class SingeplayerGameComponent implements OnInit {

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
  }


  board = [['', '', ''],
    ['', '', ''],
    ['', '', '']];
  currentPlayer: 'X' | 'O' = null;
  otherPlayer: 'X' | 'O' = null;
  turn = false;

  ai_openField(index_i: number, index_j: number) {
    if (this.board[index_i][index_j]) {
      let bestMove = this.findBestMove();
      this.board[bestMove.row][bestMove.col] = 'O';
      return;
    }
    this.board[index_i][index_j] = 'O';
  }

  openField(index_i: number, index_j: number) {


    if (this.board[index_i][index_j]) {
      return;
    }
    this.board[index_i][index_j] = 'X';


    let bestMove = this.findBestMove();
    if(bestMove.col === -1 || bestMove.row === -1){
      this.openDialog();
      return;
    }
    this.ai_openField(bestMove.row,bestMove.col);
    let result = this.checkWinner();
    if(result !== null){
      console.log("Win");
      this.openDialog();
    }


  }


  openDialog(): void {

    this.dialog.open(ResultDialogComponent, {
      width: '250px',
      data: {winner: this.checkWinner()}
    })
  }

  isMovesLeft() {
    for (let i = 0; i < this.board.length; i++)
      for (let j = 0; j < this.board.length; j++)
        if (this.board[i][j] == '')
          return true;

    return false;
  }


  minimax(depth: number, isMax: any) {
    this.currentPlayer = this.turn ? 'X' : 'O';
    this.otherPlayer = this.turn ? 'O' : 'X';
    let score = this.evaluate();

    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10)
      return score;

    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10)
      return score;

    // If there are no more moves and
    // no winner then it is a tie
    if (this.isMovesLeft() == false)
      return 0;

    // If this maximizer's move
    if (isMax) {
      let best = -1000;

      // Traverse all cells
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board.length; j++) {

          // Check if cell is empty
          if (this.board[i][j] == '') {

            // Make the move
            this.board[i][j] = this.currentPlayer;

            // Call minimax recursively
            // and choose the maximum value
            best = Math.max(best, this.minimax(
              depth + 1, !isMax));

            // Undo the move
            this.board[i][j] = '';
          }
        }
      }
      return best;
    }

    // If this minimizer's move
    else {
      let best = 1000;

      // Traverse all cells
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board.length; j++) {

          // Check if cell is empty
          if (this.board[i][j] == '') {

            // Make the move
            this.board[i][j] = this.otherPlayer;

            // Call minimax recursively and
            // choose the minimum value
            best = Math.min(best, this.minimax(
              depth + 1, !isMax));

            // Undo the move
            this.board[i][j] = '';
          }
        }
      }
      return best;
    }
  }

// This will return the best possible
// move for the player
  findBestMove() {
    let bestVal = -1000;
    let bestMove = {
      col: -1,
      row: -1
    }

    // Traverse all cells, evaluate
    // minimax function for all empty
    // cells. And return the cell
    // with optimal value.
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {

        // Check if cell is empty
        if (this.board[i][j] == '') {

          // Make the move
          this.board[i][j] = this.currentPlayer;

          // compute evaluation function
          // for this move.
          let moveVal = this.minimax(0, false);

          // Undo the move
          this.board[i][j] = '';

          // If the value of the current move
          // is more than the best value, then
          // update best
          if (moveVal > bestVal) {
            bestMove.row = i;
            bestMove.col = j;
            bestVal = moveVal;
          }
        }
      }
    }

    return bestMove;
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
  evaluate() {
    this.currentPlayer = this.turn ? 'X' : 'O';
    this.otherPlayer = this.turn ? 'O' : 'X';
    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][0] == this.board[row][1] &&
        this.board[row][1] == this.board[row][2]) {
        if (this.board[row][0] == this.currentPlayer)
          return +10;

        else if (this.board[row][0] == this.otherPlayer)
          return -10;
      }
    }

    // Checking for Columns for X or O victory.
    for (let col = 0; col < this.board.length; col++) {
      if (this.board[0][col] == this.board[1][col] &&
        this.board[1][col] == this.board[2][col]) {
        if (this.board[0][col] == this.currentPlayer)
          return +10;

        else if (this.board[0][col] == this.otherPlayer)
          return -10;
      }
    }

    // Checking for Diagonals for X or O victory.
    if (this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
      if (this.board[0][0] == this.currentPlayer)
        return +10;

      else if (this.board[0][0] == this.otherPlayer)
        return -10;
    }

    if (this.board[0][2] == this.board[1][1] &&
      this.board[1][1] == this.board[2][0]) {
      if (this.board[0][2] == this.currentPlayer)
        return +10;

      else if (this.board[0][2] == this.otherPlayer)
        return -10;
    }

    // Else if none of them have
    // won then return 0
    return 0;
  }

}
