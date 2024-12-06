import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MyLinkComponent} from './components/myLink/my-link.component';
import {HeadlineComponent} from './components/headline/headline.component';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faRotateRight, faCircleChevronRight} from '@fortawesome/free-solid-svg-icons';
import {NewsComponent} from './components/news/news.component';


@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, MyLinkComponent, HeadlineComponent, FaIconComponent, FormsModule, NgForOf, NgIf, NewsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', 'components/myLink/my-link.component.scss', 'components/headline/headline.component.scss']
})
export class AppComponent {

    faRotateRight = faRotateRight;

}
