import { API_ROUTES } from "@/constants/ApiRoute";
import { testimonialsAllDataInterface } from "./testimonials.interface";


export const getTestimonials = async () => {
    try {
        const response = await fetch(API_ROUTES.TESTIMONIALS.GET_ALL,{
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

export const getTestimonialsById = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.TESTIMONIALS.GET_BY_ID(id),{
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

export const getFilteredTestimonials = async (params: string) => {
    try {
        const response = await fetch(API_ROUTES.TESTIMONIALS.GET_BY_PARAMS(params),{
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

export const addTestimonials = async (data: testimonialsAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.TESTIMONIALS.ADD, {
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

export const updateTestimonials = async (id: string, data: testimonialsAllDataInterface) => {
    try {
        let response = await fetch(API_ROUTES.TESTIMONIALS.UPDATE(id), {
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

export const deleteTestimonials = async (id: string) => {
    try {
        const response = await fetch(API_ROUTES.TESTIMONIALS.DELETE(id), {
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
