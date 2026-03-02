export interface roomAllotmentAllDataInterface {
    Property:string;
    Guest:string;
    Room?:{id:string, name:string};
    FromDate:string;
    ToDate:string;
    roomId?:string;
}

export interface roomAllotmentGetDataInterface {
    _id: string;
    Property:string;
    Guest:string;
    Room:string;
    FromDate:string;
    ToDate:string;
}

export interface roomAllotmentDialogDataInterface {
    id: string;
    Property:string;
    Room:string;
  }

  export interface roomAllotmentDeleteAllPayloadInterface {
  roomAllotmentIds: string[];
}