import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getApplication,
    downloadCertificate,
} from "../../services/applicationService";

export default function ApplicationDetails() {

    const { id } = useParams();

    const [application, setApplication] = useState(null);

    useEffect(() => {
        loadApplication();
    }, []);

    async function loadApplication() {

        try {

            const data = await getApplication(id);

            console.log(data);

            setApplication(data);

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Failed to load application."
            );

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

    if (!application) {

        return (
            <>
                <Navbar />
                <div className="p-10">
                    Loading...
                </div>
            </>
        );

    }

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

                            {application.status}

                        </p>

                        <p>

                            <strong>Application ID:</strong>

                            {" "}

                            {application.id}

                        </p>

                        <p>

                            <strong>Submitted:</strong>

                            {" "}

                            {application.created_at}

                        </p>

                    </div>

                    {application.status === "approved" && (

                        <button
                            onClick={handleDownload}
                            className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg"
                        >
                            Download Certificate
                        </button>

                    )}

                </div>

            </div>

        </>

    );

}