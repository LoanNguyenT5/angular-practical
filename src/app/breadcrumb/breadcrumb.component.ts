import { Component, EventEmitter, Output } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [
        NzBreadCrumbModule,
        NzIconModule,
        NzButtonModule
    ],
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
    @Output() newUser = new EventEmitter<void>();

    onNewUser() {
        this.newUser.emit();
    }
}
