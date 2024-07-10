import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Containers
import { PageComponent } from './page/page.component';
import { HomeComponent } from '../general/home/home.component';

const routes: Routes = [
  { path: 'page', component: PageComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
