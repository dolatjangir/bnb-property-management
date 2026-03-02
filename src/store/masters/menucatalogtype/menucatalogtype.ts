// note do not use any

import { API_ROUTES } from "@/constants/ApiRoute"
import { menuCatalogTypeAllDataInterface, menuCatalogTypeDeleteAllPayloadInterface } from "./menucatalogtype.interface";



export const getMenuCatalogType = async () => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.GET_ALL, {
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

export const getMenuCatalogTypeById = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.GET_BY_ID(id), {
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

export const getMenuCatalogTypeByMenuCatalog = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.GET_ALL_BY_MENUCATALOG(id), {
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

export const getFilteredMenuCatalogType = async (params: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.GET_BY_PARAMS(params), {
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

export const addMenuCatalogType = async (data: menuCatalogTypeAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.ADD,
            {
                method: "POST",
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

export const updateMenuCatalogType = async (id: string, data: menuCatalogTypeAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.UPDATE(id),
            {
                method: "PUT",
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

export const deleteMenuCatalogType = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.DELETE(id),
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

export const deleteAllMenuCatalogType = async (payload: menuCatalogTypeDeleteAllPayloadInterface) => {
    try {
        const response = await fetch(API_ROUTES.MASTERS.MENUCATALOGTYPE.DELETEALL,
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