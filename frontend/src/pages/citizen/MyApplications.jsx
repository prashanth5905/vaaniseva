import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";

export default function MyApplications() {

    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadApplications();
    }, []);

    async function loadApplications() {
        try {
            const data = await getMyApplications();
            setApplications(data);
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Failed to load applications."
            );
        }
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100 flex justify-center">

                <div className="w-full max-w-5xl bg-white mt-10 p-8 rounded-xl shadow">

                    <h1 className="text-3xl font-bold text-blue-600">
                        My Applications
                    </h1>

                    <div className="mt-6 space-y-4">

                        {applications.length === 0 ? (

                            <div className="text-center py-10 text-gray-500">
                                No applications submitted yet.
                            </div>

                        ) : (

                            applications.map((app) => (

                                <div
                                    key={app.id}
                                    className="border rounded-lg p-5"
                                >

                                    <p>
                                        <b>Application ID:</b> {app.id}
                                    </p>

                                    <p>
                                        <b>Service:</b> {app.service_name}
                                    </p>

                                    <p className="mt-2">
                                        <b>Status:</b>{" "}
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-sm ${
                                                app.status === "approved"
                                                    ? "bg-green-600"
                                                    : app.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-600"
                                            }`}
                                        >
                                            {app.status}
                                        </span>
                                    </p>

                                    <p>
                                        <b>Submitted:</b> {new Date(app.created_at).toLocaleDateString("en-IN", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(`/applications/${app.id}`)
                                        }
                                        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
                                    >
                                        View Details
                                    </button>

                                </div>
                            ))
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}