import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MyLinkComponent} from './components/myLink/my-link.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyLinkComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
