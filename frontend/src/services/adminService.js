import api from "../api/axios";


export async function getPendingApplications(){

    const response = await api.get(
        "/admin/applications/pending"
    );

    return response.data;
}


export async function getApplicationDetails(id){

    const response = await api.get(
        `/admin/applications/${id}`
    );

    return response.data;
}


export async function approveApplication(id){

    const response = await api.post(
        `/admin/applications/${id}/approve`
    );

    return response.data;
}


export async function rejectApplication(id){

    const response = await api.post(
        `/admin/applications/${id}/reject`
    );

    return response.data;
}


export async function getAdminDashboard(){

    const response = await api.get(
        "/admin/dashboard"
    );

    return response.data;
}

export async function downloadDocument(id){

    const response = await api.get(
        `/documents/${id}/download`,
        {
            responseType:"blob"
        }
    );


    const url =
    window.URL.createObjectURL(
        new Blob([response.data])
    );


    const link =
    document.createElement("a");


    link.href=url;

    link.download="document.pdf";

    link.click();

}