// note do not use any

import { API_ROUTES } from "@/constants/ApiRoute"
import toast from "react-hot-toast";
import { foodMenuAssignInterface, foodMenuDeletePayloadInterface } from "./foodmenu.interface";


export const getFoodMenu = async () => {
  try {
    const response = await fetch(API_ROUTES.FOODMENU.GET_ALL, { credentials: "include" });
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

export const getFoodMenuById = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.FOODMENU.GET_BY_ID(id), { credentials: "include" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.log("SERVER ERROR: ", error)
    return null;
  }
}

export const getFavoutiteFoodMenu = async () => {
  try {
    const response = await fetch(API_ROUTES.FOODMENU.GET_FAVOURITES_FOODMENU, { credentials: "include" });
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



export const getFilteredFoodMenu = async (params: string) => {
  try {
    const response = await fetch(API_ROUTES.FOODMENU.GET_BY_PARAMS(params), { credentials: "include" });
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

export const addFoodMenu = async (formData: FormData) => {
  try {

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(API_ROUTES.FOODMENU.ADD, {
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

export const importFoodMenu = async (formData: FormData) => {
  try {

    /* for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } */


    const response = await fetch(API_ROUTES.FOODMENU.FOODMENUIMPORT, {
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
    const response = await fetch(API_ROUTES.FOODMENU.FOODMENUEXCELHEADERS, {
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

export const assignFoodMenu = async (data: foodMenuAssignInterface) => {
  try {

    console.log("assign customer data ", data)
    const response = await fetch(API_ROUTES.FOODMENU.ASSIGNFOODMENU, {
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




export const updateFoodMenu = async (id: string, formData: FormData) => {
  try {



    //Don't manually set "Content-Type" — fetch will handle it for FormData
    const response = await fetch(API_ROUTES.FOODMENU.UPDATE(id), {
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

export const deleteFoodMenu = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.FOODMENU.DELETE(id),
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

export const deleteAllFoodMenu = async (payload: foodMenuDeletePayloadInterface) => {
  try {
    const response = await fetch(API_ROUTES.FOODMENU.DELETEALL,
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


