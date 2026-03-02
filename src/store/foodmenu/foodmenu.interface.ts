export interface foodMenuAllDataInterface {
  Name: string;
  Description: string;
  MenuCatalog: { id: string; name: string };
  MenuCatalogType: { id: string; name: string };
  Price: string;
  Stock: string;
  isFavourite?: boolean;
  FoodMenuFields?: any[];
  FoodMenuImage: File[];
}

export interface foodMenuImportDataInterface {
  Name: string;
  Description: string;
  MenuCatalog: string;
  MenuCatalogType: string;
  Price: string;
  Stock: string;
  isFavourite?: boolean;
}

export interface foodMenuGetDataInterface {
  _id: string;
  Name: string;
  Description: string;
  MenuCatalog: string;
  MenuCatalogType: string;
  Price: string;
  isFavourite?: boolean;
  isChecked?: boolean;
  Stock: string;
  AssignTo?: string;
  GuestImage?: string;
}


export interface GuestAdvInterface {
  _id: string[];
  Name: string[];
  MenuCatalog: string[];
  MenuCatalogType: string[];
  User: string[];
  StartDate: string;
  EndDate: string;
  Limit: string[];
}

export interface foodMenuAssignInterface {
  foodMenuIds: string[];
  assignToId: string;
}


export interface foodMenuDeletePayloadInterface {
  foodMenuIds: string[];
}

export interface foodMenuDeleteDialogDataInterface {
  id: string;
  Name: string;
  Stock: string;
  isFavourite?: boolean;
  isChecked?: boolean;
}


export interface CheckDialogDataInterface {
  id: string;
  isChecked?: boolean;
}