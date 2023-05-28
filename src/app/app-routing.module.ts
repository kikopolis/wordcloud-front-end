import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SendformComponent }    from './sendform/sendform.component';
import { CloudComponent } from './cloud/cloud.component';
import { InprogressComponent } from './inprogress/inprogress.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'sendform', component: SendformComponent },
    { path: 'cloud', component: CloudComponent },
    { path: 'inprogress', component: InprogressComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
