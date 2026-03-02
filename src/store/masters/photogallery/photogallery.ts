import { API_ROUTES } from "@/constants/ApiRoute";


// 🟩 Get All PhotoGallery
export const getPhotoGallery = async () => {
  try {
    const response = await fetch(API_ROUTES.MASTERS.PHOTOGALLERY.GET_ALL, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("SERVER ERROR (getPhotoGallery): ", error);
    return null;
  }
};

// 🟩 Get Amenity by ID
export const getPhotoGalleryById = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.MASTERS.PHOTOGALLERY.GET_BY_ID(id), {
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
    console.log("SERVER ERROR (getPhotoGalleryById): ", error);
    return null;
  }
};

// 🟩 Get Filtered PhotoGallery
export const getFilteredPhotoGallery = async (params: string) => {
  try {
    const response = await fetch(API_ROUTES.MASTERS.PHOTOGALLERY.GET_BY_PARAMS(params), {
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
    console.log("SERVER ERROR (getFilteredPhotoGallery): ", error);
    return null;
  }
};

// 🟩 Add Amenity
export const addPhotoGallery = async (formData:FormData) => {
  try {
    let response = await fetch(API_ROUTES.MASTERS.PHOTOGALLERY.ADD, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    response = await response.json();
    return response;
  } catch (error) {
    console.log("SERVER ERROR (addPhotoGallery): ", error);
    return null;
  }
};

// 🟩 Update Amenity
export const updatePhotoGallery = async (id: string, formData:FormData) => {
  try {
    let response = await fetch(API_ROUTES.MASTERS.PHOTOGALLERY.UPDATE(id), {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    response = await response.json();
    return response;
  } catch (error) {
    console.log("SERVER ERROR (updatePhotoGallery): ", error);
    return null;
  }
};

// 🟩 Delete Amenity
export const deletePhotoGallery = async (id: string) => {
  try {
    const response = await fetch(API_ROUTES.MASTERS.PHOTOGALLERY.DELETE(id), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("SERVER ERROR (deletePhotoGallery): ", error);
    return null;
  }
};
