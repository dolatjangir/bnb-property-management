import { API_ROUTES } from "@/constants/ApiRoute"
import { propertyFieldsAllDataInterface } from "./propertyfields.interface";


export const getPropertyFieldLabel = async () => {
    try {
        const response = await fetch(API_ROUTES.SETTINGS.PROPERTYFIELDLABEL.GET_ALL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("SERVER ERROR: ", error)
        return null;
    }
}


export const updatePropertyFieldLabel = async (data: propertyFieldsAllDataInterface[]) => {
    try {
        let response = await fetch(API_ROUTES.SETTINGS.PROPERTYFIELDLABEL.UPDATE,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        response = await response.json();
        return data;
    }
    catch (error) {
        console.log("SERVER ERROR: ", error)
        return null;
    }
}
