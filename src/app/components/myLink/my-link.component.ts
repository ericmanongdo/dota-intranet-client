import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faRotateRight, faCircleChevronRight, faPencilSquare} from '@fortawesome/free-solid-svg-icons';
import {MyLink} from '../../common/my-link';
import {MyLinkService} from '../../service/my-link.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MyLinkCategory} from '../../common/my-link-category';

@Component({
    selector: 'app-my-link',
    standalone: true,
    imports: [FontAwesomeModule, NgForOf, FormsModule, NgIf, NgClass],
    templateUrl: './my-link.component.html',
    styleUrls: ['./my-link.component.scss']
})
export class MyLinkComponent implements OnInit {
    myLink: MyLink[] = [];
    categories: MyLinkCategory[] = [];
    groupedLinks: { categoryName: string; links: MyLink[] }[] = [];
    currentLink: MyLink = {
        selection: '',
        title: '',
        url: '',
        textColor: '',
        backgroundColor: '',
        active: 1,
        categoryId: 0
    };

    faRotateRight = faRotateRight;
    faCircleChevronRight = faCircleChevronRight;
    faPencilSquare = faPencilSquare;

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

    constructor(private modalService: NgbModal, private myLinkService: MyLinkService) {}

    ngOnInit(): void {
        // Fetch both categories and links in parallel
        this.myLinkService.getCategories().subscribe(categories => {
            this.categories = categories;

            this.myLinkService.getMyLinks().subscribe(myLinks => {
                this.myLink = myLinks;

                // Group links by category using both myLinks and categories
                this.groupedLinks = this.groupLinksByCategory(this.myLink, this.categories);
            });
        });
    }

    groupLinksByCategory(myLinks: MyLink[], categories: MyLinkCategory[]): { categoryName: string; links: MyLink[] }[] {
        return categories
            .map(category => {
                const links = myLinks.filter(link => link.categoryName === category.categoryName);
                return { categoryName: category.categoryName, links };
            })
            .filter(group => group.links.length > 0); // Exclude groups with no links
    }

    openModal(content: any, link?: MyLink): void {
        if (link) {
            this.currentLink = { ...link };
            // Map categoryName to categoryId
            const category = this.categories.find(cat => cat.categoryName === link.categoryName);
            this.currentLink.categoryId = category ? category.id : 0;
        } else {
            this.currentLink = {
                selection: '',
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

    selectCategory(id: number): void {
        this.currentLink.categoryId = id;
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find(cat => cat.id === categoryId); // Match `id` from the backend
        return category ? category.categoryName : '';
    }

    saveLink(modal: any): void {
        if (!this.currentLink.categoryId) {
            return;
        }

        const payload = { ...this.currentLink };

        if (this.currentLink.id) {
            this.myLinkService.updateLink(this.currentLink.id, payload).subscribe(updatedLink => {
                const index = this.myLink.findIndex(link => link.id === updatedLink.id);
                if (index !== -1) this.myLink[index] = updatedLink;
                this.groupedLinks = this.groupLinksByCategory(this.myLink, this.categories);
                modal.close();
            });
        } else {
            this.myLinkService.addLink(payload).subscribe(newLink => {
                this.myLink.push(newLink);
                this.groupedLinks = this.groupLinksByCategory(this.myLink, this.categories);
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
            this.myLinkService.deleteLink(this.currentLink.id).subscribe(() => {
                console.log('Link deleted:', this.currentLink.id);
                // Remove the deleted link from the array
                this.myLink = this.myLink.filter(link => link.id !== this.currentLink.id);
                // Regroup links
                this.groupedLinks = this.groupLinksByCategory(this.myLink, this.categories);
                modal.close();
            });
        }
    }

}
