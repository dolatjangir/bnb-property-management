import { API_ROUTES } from "@/constants/ApiRoute";
import { headAllDataInterface } from "./head.interface";


export const getHead = async () => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.HEAD.GET_ALL,{
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

export const getHeadById = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.HEAD.GET_BY_ID(id),{
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

export const getFilteredHead = async (params: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.HEAD.GET_BY_PARAMS(params),{
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

export const addHead = async (data: headAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.MASTERS.HEAD.ADD, {
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

export const updateHead = async (id: string, data: headAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.MASTERS.HEAD.UPDATE(id), {
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

export const deleteHead = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.HEAD.DELETE(id), {
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
