import { API_ROUTES } from "@/constants/ApiRoute";
import { floorAllDataInterface } from "./floor.interface";


export const getFloor = async () => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.FLOOR.GET_ALL,{
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
        console.log("SERVER ERROR: ", error);
        return null;
    }
};

export const getFloorById = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.FLOOR.GET_BY_ID(id),{
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
        console.log("SERVER ERROR: ", error);
        return null;
    }
};

export const getFilteredFloor = async (params: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.FLOOR.GET_BY_PARAMS(params),{
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
        console.log("SERVER ERROR: ", error);
        return null;
    }
};

export const addFloor = async (data: floorAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.MASTERS.FLOOR.ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        response = await response.json();
        return data;
    } 
    catch (error) {
        console.log("SERVER ERROR: ", error);
        return null;
    }
};

export const updateFloor = async (id: string, data: floorAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.MASTERS.FLOOR.UPDATE(id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        response = await response.json();
        return data;
    } 
    catch (error) {
        console.log("SERVER ERROR: ", error);
        return null;
    }
};

export const deleteFloor = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.FLOOR.DELETE(id), {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.log("SERVER ERROR: ", error);
        return null;
    }
};
