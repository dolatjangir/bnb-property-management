export interface whatsappAllDataInterface {
    name:string;
    body:string;
    status:string;
}

export interface whatsappGetDataInterface {
    _id: string;
    name:string;
    status?:string;
    body?:string;
}


export interface whatsappAllPropertyInterface {
    templateId: string,
    propertyIds: string[]
}
export interface whatsappAllContactInterface {
    templateId: string,
    contactIds: string[]
}

export interface whatsappDialogDataInterface {
    id: string;
    name:string;
    status:string;
  }
 

  