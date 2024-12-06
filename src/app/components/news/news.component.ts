import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEdit, faRotateRight} from '@fortawesome/free-solid-svg-icons';
import {News} from '../../common/news';
import {NewsService} from '../../service/news.service';
import {NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {NewsCategory} from '../../common/news-category';
import {FormsModule} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../service/user.service';
import {User} from '../../common/user';

@Component({
  selector: 'app-news',
  standalone: true,
    imports: [
        FaIconComponent,
        NgForOf,
        SlicePipe,
        FormsModule,
        NgIf,
        NgClass
    ],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss', '../headline/headline.component.scss', '../myLink/my-link.component.scss']
})
export class NewsComponent implements OnInit {
    news: News[] = [];
    categories: NewsCategory[] = [];
    filteredReaders: User[] = [];
    allUsers: User[] = [];
    readersInput = '';

    selectedNews: News = {
        id: 0,
        author: 'admin',
        refNumber: '',
        headline: '',
        body: '',
        deleteDate: null,
        returnReceipt: 1,
        categoryName: '',
        categoryId: 0,
        readers: []
    };
    protected readonly faRotateRight = faRotateRight;
    protected readonly faEdit = faEdit;
    constructor(
        private modalService: NgbModal,
        private newsService: NewsService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.fetchNews();
        this.fetchCategories();
        this.fetchUsers();
    }

    private fetchNews() {
        this.newsService.getNews().subscribe({
            next: (data) => {
                this.news = data;
            },
            error: (err) => console.error('Error fetching headlines:', err),
        });
    }

    private fetchCategories() {
        this.newsService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
            },
            error: (err) => console.error('Error fetching categories:', err),
        });
    }

    private fetchUsers() {
        this.userService.getUsers().subscribe({
            next: (data) => {
                this.allUsers = data;
            },
            error: (err) => console.error('Error fetching users:', err),
        });
    }

    getCategoryName(id: number): string {
        const category = this.categories.find((cat) => cat.id === id);
        return category ? category.categoryName : '';
    }

    selectCategory(id: number): void {
        this.selectedNews.categoryId = id;
    }

    saveNews(modal: any): void {
        console.log('Request body:', this.selectedNews);
        if (!this.selectedNews) return;

        // Ensure returnReceipt remains a number
        this.selectedNews.returnReceipt = this.selectedNews.returnReceipt ? 1 : 0;

        if (this.selectedNews.id) {
            // Update existing news
            this.newsService.updateNews(this.selectedNews.id, this.selectedNews).subscribe({
                next: (updatedNews) => {
                    const index = this.news.findIndex((newsItem) => newsItem.id === updatedNews.id);
                    if (index !== -1) {
                        this.news[index] = updatedNews; // Update the item in the news array
                    }
                    modal.close(); // Close the modal
                    console.log('News updated:', updatedNews);
                },
                error: (err) => {
                    console.error('Error updating news:', err);
                },
            });
        } else {
            // Create new news
            const { id, ...payload } = this.selectedNews; // Remove the ID if it's undefined
            console.log('New news payload:', payload);

            this.newsService.addNews(payload).subscribe({
                next: (newNews) => {
                    this.news.push(newNews); // Add the new news to the list
                    modal.close(); // Close the modal
                    console.log('News added:', newNews);
                },
                error: (err) => {
                    console.error('Error adding news:', err);
                },
            });
        }
    }

    openModal(content: any, newsItem?: News): void {
        this.selectedNews = newsItem
            ? { ...newsItem }
            : {
                id: 0,
                author: 'admin',
                refNumber: '',
                headline: '',
                body: '',
                deleteDate: null,
                returnReceipt: 1,
                categoryName: '',
                categoryId: 0,
                readers: []
            };

        // Open the modal
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    openNewsBody(content: any, newsItem: News): void {
        this.selectedNews = newsItem;
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
    }

    onReturnReceiptChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        this.selectedNews.returnReceipt = checkbox.checked ? 1 : 0; // Explicit conversion to number
    }

    onReadersInput(): void {
        const input = this.readersInput.toLowerCase();
        this.filteredReaders = this.allUsers.filter((user) =>
            user.username.toLowerCase().includes(input)
        );
    }

    addReader(user: User): void {
        if (!this.selectedNews.readers) {
            this.selectedNews.readers = []; // Initialize as an empty array of strings
        }

        // Prevent duplicates by checking the username
        if (!this.selectedNews.readers.includes(user.username)) {
            this.selectedNews.readers.push(user.username); // Add only the username
        }

        // Clear input and filtered list after selection
        this.readersInput = '';
        this.filteredReaders = [];
    }

    removeReader(username: string): void {
        this.selectedNews.readers = this.selectedNews.readers.filter(
            (reader) => reader !== username
        );
    }

    handleKeyDown(event: KeyboardEvent, item: User): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // Prevent scrolling for space key
            this.addReader(item);
        }
    }

    deleteNews(id: number): void {
        if (confirm('Are you sure you want to delete this news item?')) {
            this.newsService.deleteNews(id).subscribe({
                next: () => {
                    this.news = this.news.filter((newsItem) => newsItem.id !== id);
                    console.log('News deleted successfully.');
                },
                error: (err) => {
                    console.error('Error deleting news:', err);
                },
            });
        }
    }

}
