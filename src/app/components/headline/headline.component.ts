import {Component, OnInit} from '@angular/core';
import {HeadlineService} from '../../service/headline.service';
import {UserService} from '../../service/user.service';
import {Headline} from '../../common/headline';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEdit, faRotateRight} from '@fortawesome/free-solid-svg-icons';
import {NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../common/user';

@Component({
    selector: 'app-headline',
    standalone: true,
    templateUrl: './headline.component.html',
    styleUrls: ['./headline.component.scss', '../myLink/my-link.component.scss'],
    imports: [
        SlicePipe,
        FaIconComponent,
        FormsModule,
        NgForOf,
        NgIf,
        NgClass
    ]
})
export class HeadlineComponent implements OnInit {
    headlines: Headline[] = [];
    allUsers: User[] = [];
    filteredUsers: User[] = [];
    filteredCollaborators: User[] = [];
    selectedHeadline: Headline = {
        id: 0,
        subject: '',
        postedBy: 'admin',
        body: '',
        postActiveDate: null,
        postRemoveDate: null,
        postDeleteDate: null,
        sharedUsers: [],
        collaborators: [],
    };

    protected readonly faRotateRight = faRotateRight;
    protected readonly faEdit = faEdit;
    sharedUsersInput = '';
    collaboratorsInput = '';

    constructor(
        private modalService: NgbModal,
        private headlineService: HeadlineService,
        private userService: UserService
        ) {}

    ngOnInit(): void {
        this.fetchHeadlines();
        this.fetchUsers();
    }

    fetchHeadlines(): void {
        this.headlineService.getHeadlines().subscribe({
            next: (data) => {
                this.headlines = data;
            },
            error: (err) => console.error('Error fetching headlines:', err),
        });
    }

    fetchUsers(): void {
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.allUsers = users;
            },
            error: (err) => console.error('Error fetching users:', err),
        });
    }

    openModal(content: any, headline?: Headline): void {
        this.selectedHeadline = headline
            ? { ...headline }
            : {
                id: 0,
                subject: '',
                postedBy: 'admin',
                body: '',
                postActiveDate: null,
                postRemoveDate: null,
                postDeleteDate: null,
                sharedUsers: [],
                collaborators: [],
            };

        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }

    // Open a specific headline's details
    openHeadline(id: number | undefined, modal: any): void {
        if (id === undefined) {
            console.error('Headline ID is undefined!');
            return;
        }

        this.headlineService.getHeadlineById(id).subscribe({
            next: (headline) => {
                this.selectedHeadline = headline;
                this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' });
            },
            error: (err) => {
                console.error('Error fetching headline:', err);
            }
        });
    }

    // Save or update the headline
    saveHeadline(modal: any): void {
        if (!this.selectedHeadline) return;

        if (this.selectedHeadline.id) {
            this.headlineService.updateHeadline(this.selectedHeadline.id, this.selectedHeadline).subscribe({
                next: (updatedHeadline) => {
                    const index = this.headlines.findIndex((headline) => headline.id === updatedHeadline.id);
                    if (index !== -1) this.headlines[index] = updatedHeadline;
                    modal.close();
                },
                error: (err) => console.error('Error updating headline:', err),
            });
        } else {
            const { id, ...payload } = this.selectedHeadline;
            console.log('Selected headline:', payload);

            this.headlineService.addHeadline(payload).subscribe({
                next: (newHeadline) => {
                    this.headlines.push(newHeadline);
                    modal.close();
                },
                error: (err) => console.error('Error adding headline:', err),
            });
        }
    }

    onSharedUsersInput(): void {
        const input = this.sharedUsersInput.toLowerCase();
        this.filteredUsers = this.allUsers.filter((user) =>
            user.username.toLowerCase().includes(input)
        );
    }

    addSharedUser(user: User): void {
        if (!this.selectedHeadline.sharedUsers.includes(user.username)) {
            this.selectedHeadline.sharedUsers.push(user.username);
        }
        this.sharedUsersInput = '';
        this.filteredUsers = [];
    }

    removeSharedUser(username: string): void {
        this.selectedHeadline.sharedUsers = this.selectedHeadline.sharedUsers.filter(
            (user) => user !== username
        );
    }

    onCollaboratorsInput(): void {
        const input = this.collaboratorsInput.toLowerCase();
        this.filteredCollaborators = this.allUsers.filter((user) =>
            user.username.toLowerCase().includes(input)
        );
    }

    addCollaborator(user: User): void {
        if (!this.selectedHeadline.collaborators.includes(user.username)) {
            this.selectedHeadline.collaborators.push(user.username);
        }
        this.collaboratorsInput = '';
        this.filteredCollaborators = [];
    }

    removeCollaborator(username: string): void {
        this.selectedHeadline.collaborators = this.selectedHeadline.collaborators.filter(
            (user) => user !== username
        );
    }

    handleKeyDown(event: KeyboardEvent, user: User, type: 'sharedUsers' | 'collaborators'): void {
        if (event.key === 'Enter' || event.key === ' ') {
            if (type === 'sharedUsers') {
                this.addSharedUser(user);
            } else {
                this.addCollaborator(user);
            }
            event.preventDefault(); // Prevent default browser behavior
        }
    }

    deleteHeadline(id: number, modal: any): void {
        if (confirm('Are you sure you want to delete this headline?')) {
            this.headlineService.deleteHeadline(id).subscribe({
                next: () => {
                    console.log(`Headline with ID ${id} deleted.`);
                    this.headlines = this.headlines.filter(headline => headline.id !== id); // Update local list
                    modal.dismiss();
                },
                error: err => console.error('Error deleting headline:', err)
            });
        }
    }

    refreshHeadlines(): void {
        this.fetchHeadlines();
    }
}
