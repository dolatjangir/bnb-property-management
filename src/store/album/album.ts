import { API_ROUTES } from "@/constants/ApiRoute";
import { albumAllDataInterface } from "./album.interface";


// Get All Album
export const getAlbum = async () => {
  try {
    const response = await fetch(API_ROUTES.ALBUM.GET_ALL, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("SERVER ERROR (getAlbum): ", error);
    return null;
  }
};

// Get Amenity by ID
export const getAlbumById = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.ALBUM.GET_BY_ID(id), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("SERVER ERROR (getAlbumById): ", error);
    return null;
  }
};

// Get Filtered Album
export const getFilteredAlbum = async (params: string) => {
  try {
    const response = await fetch(API_ROUTES.ALBUM.GET_BY_PARAMS(params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("SERVER ERROR (getFilteredAlbum): ", error);
    return null;
  }
};

// Add Amenity
export const addAlbum = async (payload: albumAllDataInterface) => {
  try {
    let response = await fetch(API_ROUTES.ALBUM.ADD, {
      method: "POST",
       headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    response = await response.json();
    return response;
  } catch (error) {
    console.log("SERVER ERROR (addAlbum): ", error);
    return null;
  }
};

// Update Amenity
export const updateAlbum = async (id: string, payload: albumAllDataInterface) => {
  try {
    let response = await fetch(API_ROUTES.ALBUM.UPDATE(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    response = await response.json();
    return response;
  } catch (error) {
    console.log("SERVER ERROR (updateAlbum): ", error);
    return null;
  }
};

//  Delete Amenity
export const deleteAlbum = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.ALBUM.DELETE(id), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("SERVER ERROR (deleteAlbum): ", error);
    return null;
  }
};
