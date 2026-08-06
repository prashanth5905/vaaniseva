import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getApplication,
    downloadCertificate,
} from "../../services/applicationService";
import { getCitizenProfile } from "../../services/citizenService";
import { getDocuments, viewDocument } from "../../services/documentService";

export default function ApplicationDetails() {

    const { id } = useParams();

    const [application, setApplication] = useState(null);
    const [citizen, setCitizen] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadApplication();
    }, [id]);

    async function loadApplication() {

        try {
            setLoading(true);
            setError("");

            const [applicationData, citizenData, documentsData] = await Promise.all([
                getApplication(id),
                getCitizenProfile(),
                getDocuments(),
            ]);

            setApplication(applicationData);
            setCitizen(citizenData);
            setDocuments(documentsData);

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to load application details."
            );

        } finally {
            setLoading(false);

        }

    }

    async function handleDownload() {

        try {

            const blob = await downloadCertificate(id);

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = "certificate.pdf";

            a.click();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Download failed."
            );

        }

    }

    async function handleViewDocument(documentId) {
        try {
            const blob = await viewDocument(documentId);
            const url = window.URL.createObjectURL(blob);

            window.open(url, "_blank");

            window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Unable to open document."
            );
        }
    }

    if (loading) {

        return (
            <>
                <Navbar />
                <div className="p-10">
                    Loading...
                </div>
            </>
        );

    }

    if (error || !application || !citizen) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-100 p-10">
                    <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 text-red-600 shadow">
                        {error || "Application details are unavailable."}
                    </div>
                </div>
            </>
        );
    }

    const status = application.status.toUpperCase();

    return (

        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100 flex justify-center">

                <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8 mt-10">

                    <h1 className="text-3xl font-bold text-blue-600">

                        {application.service_name}

                    </h1>

                    <div className="mt-8 space-y-3">

                        <p>

                            <strong>Status:</strong>

                            {" "}

                            {status}

                        </p>

                        <p>

                            <strong>Application ID:</strong>

                            {" "}

                            {application.id}

                        </p>

                        <p>

                            <strong>Submitted:</strong>

                            {" "}

                            {new Date(application.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}

                        </p>

                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Citizen Details
                        </h2>

                        <div className="mt-4 space-y-3">
                            <p><strong>Name:</strong> {citizen.name}</p>
                            <p><strong>Aadhaar Number:</strong> {citizen.aadhaar_number}</p>
                            <p><strong>Registered Phone:</strong> {citizen.registered_phone}</p>
                            <p><strong>District:</strong> {citizen.district}</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Uploaded Documents
                        </h2>

                        <div className="mt-4 space-y-3">
                            {documents.length === 0 ? (
                                <p className="text-gray-500">No documents uploaded.</p>
                            ) : (
                                documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p><strong>Type:</strong> {document.document_type}</p>
                                            <p><strong>File:</strong> {document.file_name}</p>
                                        </div>

                                        <button
                                            onClick={() => handleViewDocument(document.id)}
                                            className="bg-blue-600 px-4 py-2 text-white rounded"
                                        >
                                            View Document
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {status === "APPROVED" && (

                        <button
                            onClick={handleDownload}
                            className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
                        >
                            Download Certificate
                        </button>

                    )}

                    {status === "REJECTED" && (
                        <p className="mt-8 text-red-600">
                            This application was rejected.
                        </p>
                    )}

                </div>

            </div>

        </>

    );

}
