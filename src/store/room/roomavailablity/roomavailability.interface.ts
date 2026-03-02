export interface roomAvailabilityAllDataInterface {
    Property:string;
    Guest:string;
    Room:string;
    FromDate:string;
    ToDate:string;
}

export interface roomAvailabilityGetDataInterface {
    id: string;
    Property:string;
    Floor:string;
    Room:string;
    FromDate:string;
    ToDate:string;
}

export interface roomAvailabilityDialogDataInterface {
    id: string;
    Property:string;
    Room:string;
  }

  export interface roomAvailabilityDeleteAllPayloadInterface {
  roomAvailabilityIds: string[];
}