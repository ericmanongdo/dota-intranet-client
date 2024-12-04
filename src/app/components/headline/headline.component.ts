import {Component, OnInit} from '@angular/core';
import {HeadlineService} from '../../service/headline.service';
import {Headline} from '../../common/headline';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCircleChevronRight, faRotateRight} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-headline',
    standalone: true,
    imports: [
        FaIconComponent
    ],
    templateUrl: './headline.component.html',
    styleUrls: ['./headline.component.scss', '../myLink/my-link.component.scss']
})
export class HeadlineComponent implements OnInit {

    headlines: Headline[] = [];

    constructor(private headlineService: HeadlineService) {}

    ngOnInit(): void {
        this.headlineService.getHeadlines().subscribe({
            next: headlines => {
                this.headlines = headlines;
                console.log('Fetched Headlines:', this.headlines);
            },
            error: err => {
                console.error('Error fetching headlines:', err);
            }
        });
    }

    protected readonly faCircleChevronRight = faCircleChevronRight;
    protected readonly faRotateRight = faRotateRight;
}
