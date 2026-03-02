export interface menuCatalogTypeAllDataInterface {
    MenuCatalog: string;
    Name: string;
    Status: string;
}

export interface menuCatalogTypeGetDataInterface {
    _id: string;
    MenuCatalog: {
        _id: string,
        Name: string
    };
    Name: string;
    Status: string;
}

export interface menuCatalogTypeDialogDataInterface {
    id: string;
    Name: string;
    Status: string;
}

export interface menuCatalogTypeDeleteAllPayloadInterface {
  menucatalogIds: string[];
}