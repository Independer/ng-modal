import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { ModalRouteComponent } from './modal-route.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { 
    path: '', component: HomeComponent, children: [
      { path: 'modal-component', component: ModalRouteComponent }
    ]
  },
  { path: 'modal-component', outlet: 'modal', component: ModalRouteComponent }    
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }