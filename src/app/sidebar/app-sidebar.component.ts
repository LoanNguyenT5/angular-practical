import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        RouterLink,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule
    ],
    templateUrl: './app-sidebar.component.html',
    styleUrls: ['./app-sidebar.component.scss']
})
export class AppSidebarComponent {
    @Input() isCollapsed = false;
    @Output() isCollapsedChange = new EventEmitter<boolean>();

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.isCollapsedChange.emit(this.isCollapsed);
    }
}
