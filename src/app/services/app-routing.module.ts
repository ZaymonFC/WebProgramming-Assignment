import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router'

// Component Imports
import { HomeComponent } from '../home/home.component'
import { ChatComponent } from '../chat/chat.component'
import { NotFoundComponent } from '../not-found/not-found.component'
import { DashboardComponent } from '../dashboard/dashboard.component';
import { GroupComponent } from '../group/group.component';
import { ChannelComponent } from '../channel/channel.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: '404', component: NotFoundComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'group/:id', component: GroupComponent },
  { path: 'channel/:id', component: ChannelComponent}
  { path: '**', redirectTo: '404'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
