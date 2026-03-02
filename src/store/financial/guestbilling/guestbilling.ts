// note do not use any

import { API_ROUTES } from "@/constants/ApiRoute"
import { GuestBillingAllDataInterface } from "./guestbilling.interface";

export const getGuestBilling = async () => {
    try {
        const response = await fetch(API_ROUTES.FINANCIAL.GUESTBILLING.GET_ALL,{credentials: "include"});
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

export const getGuestBillingById = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.FINANCIAL.GUESTBILLING.GET_BY_ID(id),{credentials: "include"});
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("SERVER ERROR: ", error)
        return null;
    }
}

export const getFilteredGuestBilling = async (params: string) => {
    try {
        const response = await fetch(API_ROUTES.FINANCIAL.GUESTBILLING.GET_BY_PARAMS(params),{credentials: "include"});
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("SERVER ERROR: ", error)
        return null;
    }
}

export const addGuestBilling = async (data:GuestBillingAllDataInterface) => {
  try {

    console.log("Adding Income Marketing with data:", data);
    const response = await fetch(API_ROUTES.FINANCIAL.GUESTBILLING.ADD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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


export const updateGuestBilling = async (id: string, data:GuestBillingAllDataInterface) => {
  try {
   
    // Exclude Status from the data being sent
    const response = await fetch(API_ROUTES.FINANCIAL.GUESTBILLING.UPDATE(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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

export const deleteGuestBilling = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.FINANCIAL.GUESTBILLING.DELETE(id),
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