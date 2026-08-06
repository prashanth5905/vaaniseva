import api from "../api/axios";

export async function getDocuments() {
    const response = await api.get("/documents");
    return response.data;
}

export async function uploadDocument(file, documentType) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("document_type", documentType);

    const response = await api.post(
        "/documents/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export async function viewDocument(documentId) {
    const response = await api.get(
        `/documents/${documentId}/download`,
        {
            responseType: "blob",
        }
    );

    return response.data;
}
