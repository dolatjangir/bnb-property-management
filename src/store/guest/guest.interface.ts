export interface guestAllDataInterface {
  Property: {id:string; name: string};
  GuestName: string;
  ContactNumber: string;
  City: { id: string; name: string };
  Location: { id: string; name: string };
  Address: string;
  KycDocument: string;
  Email: string;
  GuestId: string;
  GuestDate: string;
  DOB: string;
  Gender: string;
  Other: string;
  CheckInDate: string;
  CheckOutDate: string;
  isFavourite?: boolean;
  Verified: string;
  GuestFields?: any[];
  GuestImage: File[];
  KycImage: File
}

export interface guestImportDataInterface {
  Property: string;
  GuestName: string;
  ContactNumber: string;
  City: string;
  Location: string;
  Address: string;
  Email: string;
  CustomerId: string;
  CustomerDate: string;
  Other: string;
  isFavourite?: boolean;
  Verified: string;
}

export interface guestGetDataInterface {
  _id: string;
  Property: string;
  GuestName: string;
  Email: string;
  City: string;
  Location: string;
  Address: string;
  isFavourite?: boolean;
  isChecked?: boolean;
  ContactNumber: string;
  AssignTo: string;
  Date: string;
  GuestImage?: string;
  KycImage?: string;
}


export interface GuestAdvInterface {
  _id: string[];
  StatusAssign: string[];
  Property: string[];
  City: string[];
  Location: string[];
  User: string[];
  StartDate: string;
  EndDate: string;
  Limit: string[];
}

export interface guestAssignInterface {
  guestIds: string[];
  assignToId: string;
}


export interface guestDeletePayloadInterface {
  guestIds: string[];
}

export interface DeleteDialogDataInterface {
  id: string;
  GuestName: string;
  ContactNumber: string;
  isFavourite?: boolean;
  isChecked?: boolean;
}


export interface CheckDialogDataInterface {
  id: string;
  isChecked?: boolean;
}