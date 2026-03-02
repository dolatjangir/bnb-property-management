export interface photogalleryAllDataInterface {
    Name:string;
    albumId?:string;
    Image:File;
    Status:string;
}

export interface photogalleryGetDataInterface {
    _id: string;
    Name:string;
    Image:string;
    albumId?:string;
    Status:string;
}

export interface DeleteDialogDataInterface {
    id: string;
  }