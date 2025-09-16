import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppHeaderComponent } from './header/app-header.component';
import { AppSidebarComponent } from './sidebar/app-sidebar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    NzIconModule,
    AppHeaderComponent,
    AppSidebarComponent

  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  host: { ngSkipHydration: 'true' }
})
export class App {
  isCollapsed = false;
}
