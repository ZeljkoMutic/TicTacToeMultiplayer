import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {GameComponent} from "./components/game/game.component";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'game',
    component: GameComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
