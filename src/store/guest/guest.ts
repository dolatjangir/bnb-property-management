// note do not use any

import { API_ROUTES } from "@/constants/ApiRoute"
import toast from "react-hot-toast";
import { guestAssignInterface, guestDeletePayloadInterface } from "./guest.interface";

export const getGuest = async () => {
  try {
    const response = await fetch(API_ROUTES.GUEST.GET_ALL, { credentials: "include" });
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

export const getGuestById = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.GUEST.GET_BY_ID(id), { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}

export const getFavoutiteGuest = async () => {
  try {
    const response = await fetch(API_ROUTES.GUEST.GET_FAVOURITES_GUEST, { credentials: "include" });
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



export const getFilteredGuest = async (params: string) => {
  try {
    const response = await fetch(API_ROUTES.GUEST.GET_BY_PARAMS(params), { credentials: "include" });
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

export const addGuest = async (formData: FormData) => {
  try {

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(API_ROUTES.GUEST.ADD, {
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

export const importGuest = async (formData: FormData) => {
  try {

    /* for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */


    const response = await fetch(API_ROUTES.GUEST.GUESTIMPORT, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(" import customer result ", result)
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

export const customerExcelHeaders = async (formData: FormData) => {
  try {

    /* for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */
    const response = await fetch(API_ROUTES.GUEST.GUESTEXCELHEADERS, {
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

export const assignGuest = async (data: guestAssignInterface) => {
  try {

    console.log("assign customer data ", data)
    const response = await fetch(API_ROUTES.GUEST.ASSIGNGUEST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(" assign customer api , response ", result)
    return result;
  } catch (error) {
    console.error("SERVER ERROR: ", error);
    return null;
  }
};




export const updateGuest = async (id: string, formData: FormData) => {
  try {



    //Don't manually set "Content-Type" — fetch will handle it for FormData
    const response = await fetch(API_ROUTES.GUEST.UPDATE(id), {
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

export const deleteGuest = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.GUEST.DELETE(id),
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

export const deleteAllGuest = async (payload: guestDeletePayloadInterface) => {
  try {
    const response = await fetch(API_ROUTES.GUEST.DELETEALL,
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


