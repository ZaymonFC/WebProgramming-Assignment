import { Routes } from '@angular/router'
import {HomeComponent} from './home/home.component'
import { ChatComponent } from './chat/chat.component'


export const AppRoutes = () => {
    const routes: Routes = [
        { path: 'home', component: HomeComponent },
        { path: 'chat', component: ChatComponent }
    ]

    return routes
}
