import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { GameComponent } from './components/game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { ResultDialogComponent } from './components/result-dialog/result-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { SingeplayerGameComponent } from './components/game/components/singeplayer-game/singeplayer-game.component';
import { MultiplayerGameComponent } from './components/game/components/multiplayer-game/multiplayer-game.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    GameComponent,
    ResultDialogComponent,
    SingeplayerGameComponent,
    MultiplayerGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
