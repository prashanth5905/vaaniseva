import api from "../api/axios";


export async function getCitizenProfile() {

    const response = await api.get("/profile");

    return response.data;

}



export async function getCitizenApplications() {

    const response = await api.get("/applications");

    return response.data;

}