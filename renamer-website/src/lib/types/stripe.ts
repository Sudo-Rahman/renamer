export interface PurchaseInfo {
    orderId: string;
    createdAt: string;
    amount: string;
    email: string;
    invoice?: string;
    items?: PurchaseItem[];
}

export interface PurchaseItem {
    name: string;
    quantity: number;
    price: string;
}