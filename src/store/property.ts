// note do not use any

import { API_ROUTES } from "@/constants/ApiRoute"
import { contactAllDataInterface } from "./contact.interface";
import { propertyAllDataInterface, propertyAssignInterface, propertyDeletePayloadInterface } from "./property.interface";
import toast from "react-hot-toast";

export const getProperty = async () => {
  try {
    const response = await fetch(API_ROUTES.PROPERTY.GET_ALL, { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(data)
    return data;
  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}

export const getPropertyById = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.PROPERTY.GET_BY_ID(id), { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}

export const getFavoutiteProperty = async () => {
  try {
    const response = await fetch(API_ROUTES.PROPERTY.GET_FAVOURITES_PROPERTY, { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(data)
    return data.data;
  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}



export const getFilteredProperty = async (params: string) => {
  try {
    const response = await fetch(API_ROUTES.PROPERTY.GET_BY_PARAMS(params), { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(" params : ", params,"\n"," Data:", data)
    return data;
  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}

export const addProperty = async (formData: FormData) => {
  try {

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(API_ROUTES.PROPERTY.ADD, {
      method: "POST",
      body: formData,
      credentials: "include"
    });


    const result = await response.json();
    if (!result.success) {
      toast.error(result.message ?? "Something went wrong")
      throw new Error(result.message ?? "Something went wrong")
    }
    return result;
  } catch (error) {
    console.error("SERVER ERROR: ", error);
    return null;
  }
};

export const importProperty = async (formData: FormData) => {
  try {

    /* for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */


    const response = await fetch(API_ROUTES.PROPERTY.PROPERTYIMPORT, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(" import property result ", result)
    if (!result.success) {
      toast.error(result.message ?? "Something went wrong")
      throw new Error(result.message ?? "Something went wrong")
    }
    return result;
  } catch (error) {
    console.error("SERVER ERROR: ", error);
    return null;
  }
};

export const propertyExcelHeaders = async (formData: FormData) => {
  try {

    /* for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */
    const response = await fetch(API_ROUTES.PROPERTY.PROPERTYEXCELHEADERS, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("SERVER ERROR: ", error);
    return null;
  }
};

export const assignProperty = async (data: propertyAssignInterface) => {
  try {

    console.log("assign property data ", data)
    const response = await fetch(API_ROUTES.PROPERTY.ASSIGNPROPERTY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(" assign property api , response ", result)
    return result;
  } catch (error) {
    console.error("SERVER ERROR: ", error);
    return null;
  }
};




export const updateProperty = async (id: string, formData: FormData) => {
  try {



    //Don't manually set "Content-Type" — fetch will handle it for FormData
    const response = await fetch(API_ROUTES.PROPERTY.UPDATE(id), {
      method: "PUT",
      body: formData,
      credentials: "include"
    });

    const result = await response.json();
    if (!result.success) {
      toast.error(result.message ?? "Something went wrong")
      throw new Error(result.message ?? "Something went wrong")
    }
    return result;
  } catch (error) {
    console.error("SERVER ERROR: ", error);
    return null;
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.PROPERTY.DELETE(id),
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;

  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}

export const deleteAllProperty = async (payload: propertyDeletePayloadInterface) => {
  try {
    const response = await fetch(API_ROUTES.PROPERTY.DELETEALL,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;

  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}


