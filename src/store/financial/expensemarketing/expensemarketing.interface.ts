export interface ExpenseMarketingAllDataInterface {
    Property: string;
    Head: string;
    Date: string;
    PartyName: string;
    User: string;
    Expense: string;
    Amount: string;
    DueAmount: string;
    PaymentMethode: string;
    Status: string;
    Description: string;
}
export interface ExpenseMarketingGetDataInterface {
    _id: string;
    Head: string;
    Date: string;
    PartyName: string;
    User: string;
    Expense: string;
    Amount: string;
    DueAmount: string;
    PaymentMethode: string;
    Status: string;
}

export interface ExpenseMarketingAdvInterface {
    _id: string;
    User: string[];
    Expense: string[],
    PaymentMethode: string[],
    Keyword: string,
    Limit: string[],
}
export interface ExpenseMarketingDialogDataInterface {
    id: string;
    PartyName: string;
    Amount: string;
}