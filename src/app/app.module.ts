import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

// Service Imports
import { AppRoutingModule } from './services/app-routing.module'

// Component Imports
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { ChatComponent } from './chat/chat.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { MenuComponent } from './menu/menu.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DashboardGroupComponent } from './dashboard/dashboard-group/dashboard-group.component'
import { GroupComponent } from './group/group.component'
import { RouterModule, Routes } from '@angular/router'
import { DashboardUserComponent } from './dashboard/dashboard-user/dashboard-user.component'
import { CounterComponent } from './presentation/counter/counter.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    NotFoundComponent,
    MenuComponent,
    DashboardComponent,
    DashboardGroupComponent,
    GroupComponent,
    DashboardUserComponent,
    CounterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
