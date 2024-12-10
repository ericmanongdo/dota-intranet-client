export interface News {
    id?: number;
    author: string;
    refNumber: string;
    headline: string;
    body: string;
    deleteDate:  string | null;
    returnReceipt: number;
    categoryName: string;
    categoryId: number;
    readers: string[];
}
