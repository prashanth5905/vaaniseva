import api from "../api/axios";

export async function createApplication(serviceName) {
    const response = await api.post(
        "/applications",
        {
            service_name: serviceName,
        }
    );

    return response.data;
}

export async function getApplication(id) {
    const response = await api.get(
        `/applications/${id}`
    );

    return response.data;
}

export async function downloadCertificate(id) {
    const response = await api.get(
        `/applications/${id}/certificate`,
        {
            responseType: "blob",
        }
    );

    return response.data;
}