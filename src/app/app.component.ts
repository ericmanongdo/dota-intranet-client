import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MyLinkComponent} from './components/myLink/my-link.component';
import {HeadlineComponent} from './components/headline/headline.component';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NewsComponent} from './components/news/news.component';
import {GlobalLinkComponent} from './components/globalLink/global-link.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, MyLinkComponent, HeadlineComponent, FaIconComponent, FormsModule, NgForOf, NgIf, NewsComponent, GlobalLinkComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', 'components/myLink/my-link.component.scss', 'components/headline/headline.component.scss']
})
export class AppComponent {

    constructor(private router: Router) {}

    isFullPageRoute(): boolean {
        const fullPageRoutes = ['/file-sharing'];
        return fullPageRoutes.includes(this.router.url);
    }

}
