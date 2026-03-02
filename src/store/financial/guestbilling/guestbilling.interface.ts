export interface GuestBillingAllDataInterface {
    Property?: string;
    Guest?: { id: string, name: string };
    FromDate: string;
    ToDate: string;
    Amount: string;
    RecievedAmount: string;
    DueAmount: string;
    PaymentMethod: string;
    Description: string;
    guestId?:string;
}
export interface GuestBillingGetDataInterface {
    _id: string;
    Guest: string;
    FromDate: string;
    ToDate: string;
    Amount: string;
    RecievedAmount: string;
    DueAmount: string;
    PaymentMethod: string;
}

export interface GuestBillingAdvInterface {
    _id: string;
    Property?: string[];
    Amount: string[],
    PaymentMethod: string[],
    Keyword: string,
    Limit: string[],
}
export interface GuestBillingDialogDataInterface {
    id: string;
    Guest: string;
    Amount: string;
}