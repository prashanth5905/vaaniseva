import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardList, Clock3, FileText, XCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getMyApplications } from "../../services/applicationService";

const statusDetails = {
    approved: {
        label: "Approved",
        icon: CheckCircle2,
        className: "bg-green-50 text-green-700 ring-green-200",
    },
    pending: {
        label: "Under review",
        icon: Clock3,
        className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    rejected: {
        label: "Rejected",
        icon: XCircle,
        className: "bg-red-50 text-red-700 ring-red-200",
    },
};

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadApplications();
    }, []);

    async function loadApplications() {
        try {
            setApplications(await getMyApplications());
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to load applications.");
        }
    }

    function formatDate(value) {
        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <section className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-600 px-6 py-8 text-white shadow-lg shadow-blue-700/15 sm:px-8">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-blue-100">
                                    <ClipboardList size={18} aria-hidden="true" />
                                    Application tracker
                                </div>
                                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">My Applications</h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                                    See each application’s status and open it whenever you need more information.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15">
                                <span className="text-2xl font-bold">{applications.length}</span>
                                <span className="ml-2 text-blue-100">total application{applications.length === 1 ? "" : "s"}</span>
                            </div>
                        </div>
                    </section>

                    {applications.length === 0 ? (
                        <section className="mt-6 rounded-3xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200">
                            <FileText className="mx-auto text-slate-400" size={36} aria-hidden="true" />
                            <h2 className="mt-4 text-xl font-bold text-slate-900">No applications yet</h2>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">When you apply for a certificate, it will appear here with its current status.</p>
                            <button
                                onClick={() => navigate("/apply")}
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                            >
                                Apply for a certificate <ArrowRight size={17} aria-hidden="true" />
                            </button>
                        </section>
                    ) : (
                        <section className="mt-6 grid gap-4 md:grid-cols-2">
                            {applications.map((app) => {
                                const details = statusDetails[app.status.toLowerCase()] || statusDetails.pending;
                                const StatusIcon = details.icon;

                                return (
                                    <article key={app.id} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                <FileText size={21} aria-hidden="true" />
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${details.className}`}>
                                                <StatusIcon size={15} aria-hidden="true" />
                                                {details.label}
                                            </span>
                                        </div>

                                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Application #{app.id}</p>
                                        <h2 className="mt-1 text-lg font-bold text-slate-900">{app.service_name}</h2>
                                        <p className="mt-2 text-sm text-slate-500">Submitted on {formatDate(app.created_at)}</p>

                                        <button
                                            onClick={() => navigate(`/applications/${app.id}`)}
                                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:text-blue-800"
                                        >
                                            View application <ArrowRight size={17} aria-hidden="true" />
                                        </button>
                                    </article>
                                );
                            })}
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}
