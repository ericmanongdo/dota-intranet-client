import {Component, OnInit} from '@angular/core';
import {faPencilSquare, faRotateRight} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {GlobalLink} from '../../common/global-link';
import {GlobalLinkService} from '../../service/global-link.service';
import {GlobalLinkCategory} from '../../common/global-link-category';
import {FormsModule} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-global-link',
  standalone: true,
    imports: [
        FaIconComponent,
        NgForOf,
        FormsModule,
        NgIf,
        NgClass
    ],
  templateUrl: './global-link.component.html',
  styleUrls: ['./global-link.component.scss', '../myLink/my-link.component.scss']
})
export class GlobalLinkComponent implements OnInit {
    globalLink: GlobalLink[] = [];
    categories: GlobalLinkCategory[] = [];
    groupedGlobalLinks: { categoryName: string; links: GlobalLink[] }[] = [];
    currentLink: GlobalLink = {
        title: '',
        url: '',
        textColor: '',
        backgroundColor: '',
        active: 1,
        categoryId: 0
    };
    protected readonly faRotateRight = faRotateRight;
    protected readonly faPencilSquare = faPencilSquare;

    // Color definitions
    backgroundColors = [
        { name: 'Blue', value: 'blue', contrastColor: 'white' },
        { name: 'Green', value: 'green', contrastColor: 'white' },
        { name: 'Yellow', value: 'yellow', contrastColor: 'black' },
        { name: 'Red', value: 'red', contrastColor: 'white' },
        { name: 'Magenta', value: 'magenta', contrastColor: 'white' },
        { name: 'Teal', value: 'teal', contrastColor: 'white' },
        { name: 'Orange', value: 'orange', contrastColor: 'black' },
        { name: 'Light Gray', value: 'lightgray', contrastColor: 'black' }
    ];

    textColors = [
        { name: 'Black', value: 'black', contrastColor: 'white' },
        { name: 'White', value: 'white', contrastColor: 'black' },
    ];

    constructor(
        private modalService: NgbModal,
        private globalLinkService: GlobalLinkService
    ) {}

    ngOnInit(): void {
        // Fetch both categories and links in parallel
        this.globalLinkService.getGlobalLinkCategories().subscribe(categories => {
            this.categories = categories;

            this.globalLinkService.getGlobalLinks().subscribe(links => {
                this.globalLink = links;

                // Group links by category using both myLinks and categories
                this.groupedGlobalLinks = this.groupLinksByCategory(this.globalLink, this.categories);
            });
        });
    }

    groupLinksByCategory(globalLink: GlobalLink[], categories: GlobalLinkCategory[]): { categoryName: string; links: GlobalLink[] }[] {
        return categories
            .map(category => {
                const links = globalLink.filter(link => link.categoryName === category.categoryName);
                return { categoryName: category.categoryName, links };
            })
            .filter(group => group.links.length > 0); // Exclude groups with no links
    }

    openModal(content: any, link?: GlobalLink): void {
        if (link) {
            this.currentLink = { ...link };
            // Map categoryName to categoryId
            const category = this.categories.find(cat => cat.categoryName === link.categoryName);
            this.currentLink.categoryId = category ? category.id : 0;
        } else {
            this.currentLink = {
                title: '',
                url: '',
                textColor: '',
                backgroundColor: '',
                active: 1,
                categoryId: 0
            };
        }
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find(cat => cat.id === categoryId); // Match `id` from the backend
        return category ? category.categoryName : '';
    }

    selectCategory(id: number): void {
        this.currentLink.categoryId = id;
    }

    saveLink(modal: any): void {
        if (!this.currentLink.categoryId) {
            return;
        }

        const payload = { ...this.currentLink };

        if (this.currentLink.id) {
            this.globalLinkService.updateGlobalLink(this.currentLink.id, payload).subscribe(updatedLink => {
                const index = this.globalLink.findIndex(link => link.id === updatedLink.id);
                if (index !== -1) this.globalLink[index] = updatedLink;
                this.groupedGlobalLinks = this.groupLinksByCategory(this.globalLink, this.categories);
                modal.close();
            });
        } else {
            this.globalLinkService.addGlobalLink(payload).subscribe(newLink => {
                this.globalLink.push(newLink);
                this.groupedGlobalLinks = this.groupLinksByCategory(this.globalLink, this.categories);
                modal.close();
            });
        }
    }

    deleteLink(modal: any): void {
        if (!this.currentLink.id) {
            console.error('No link selected for deletion.');
            return;
        }

        const confirmed = confirm('Are you sure you want to delete this link?');
        if (confirmed) {
            this.globalLinkService.deleteGlobalLink(this.currentLink.id).subscribe(() => {
                console.log('Link deleted:', this.currentLink.id);
                // Remove the deleted link from the array
                this.globalLink = this.globalLink.filter(link => link.id !== this.currentLink.id);
                // Regroup links
                this.groupedGlobalLinks = this.groupLinksByCategory(this.globalLink, this.categories);
                modal.close();
            });
        }
    }

}
