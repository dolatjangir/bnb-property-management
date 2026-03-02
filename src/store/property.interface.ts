export interface propertyAllDataInterface {
  Campaign: { id: string; name: string };
  PropertyType: { id: string; name: string };
  propertyName: string;
  PropertySubtype: { id: string; name: string };
  ContactNumber: string;
  City: { id: string; name: string };
  Location: { id: string; name: string };
  SubLocation: { id: string; name: string };
  Area: string;
  Address: string;
  Email: string;
  Facilities: string;
  ReferenceId: string;
  PropertyId: string;
  PropertyDate: string;
  PropertyYear: string;
  Other: string;
  Description: string;
  Video: string;
  GoogleMap: string;
  Price?: string;
  URL?: string;
  isFavourite?: boolean;
  Verified: string;
  PropertyFields?: any[];
  PropertyImage: File[];
  SitePlan: File
}

export interface propertyImportDataInterface {
  Campaign: { id: string; name: string };
  PropertyType: { id: string; name: string };
  propertyName: string;
  PropertySubtype: { id: string; name: string };
  ContactNumber: string;
  City: string;
  Location: string;
  SubLocation: string;
  Area: string;
  Address: string;
  Email: string;
  Facilities: string;
  ReferenceId: string;
  PropertyId: string;
  PropertyDate: string;
  PropertyYear: string;
  Other: string;
  Description: string;
  Video: string;
  GoogleMap: string;
  Price?: string;
  URL?: string;
  isFavourite?: boolean;
  Verified: string;
}

export interface propertyGetDataInterface {
  _id: string;
  Campaign: string;
  Price: string;
  Type: string;
  SubType: string;
  Name: string;
  Description?: string;
  Email: string;
  City: string;
  Location: string;
  SubLocation?: string;
  ReferenceId?: string;
  isFavourite?: boolean;
  isChecked?: boolean;
  ContactNumber: string;
  AssignTo: string;
  Date: string;
  SitePlan?: string;
}


export interface PropertyAdvInterface {
  _id: string[];
  StatusAssign: string[];
  Campaign: string[];
  PropertyType: string[];
  PropertySubtype: string[];
  City: string[];
  Location: string[];
  User: string[];
  StartDate: string;
  EndDate: string;
  Limit: string[];
}

export interface propertyAssignInterface {
  propertyIds: string[];
  assignToId: string;
}

export interface contactAssignInterface {
  contactIds: string[];
  assignToId: string;
}

export interface propertyDeletePayloadInterface {
  propertyIds: string[];
}

export interface DeleteDialogDataInterface {
  id: string;
  propertyName: string;
  ContactNumber: string;
  isFavourite?: boolean;
  isChecked?: boolean;
}


export interface CheckDialogDataInterface {
  id: string;
  isChecked?: boolean;
}