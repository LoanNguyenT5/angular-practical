import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        NzLayoutModule,
        NzIconModule,
        NzAvatarModule,
        NzDropDownModule,
        NzMenuModule
    ],
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
    currentLang = 'EN';

    changeLang(lang: string) {
        this.currentLang = lang;
        console.log('Language changed to:', lang);
    }
}
