export interface roomAllDataInterface {
    Property:string;
    Floor:string;
    Room:string;
    RoomType:string;
    CareTaker:string;
}

export interface roomGetDataInterface {
    _id: string;
    Property:string;
    Floor:string;
    Room:string;
    RoomType:string;
    CareTaker:string;
}

export interface roomDialogDataInterface {
    id: string;
    Property:string;
    Room:string;
  }

  export interface roomDeleteAllPayloadInterface {
  roomIds: string[];
}