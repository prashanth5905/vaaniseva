import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, ClipboardCheck, FileText, Info } from "lucide-react";
import Navbar from "../../components/Navbar";
import { createApplication } from "../../services/applicationService";

const services = [
    { name: "Income Certificate", description: "For income verification and related public-service applications." },
    { name: "Residence Certificate", description: "For confirming your residential address." },
    { name: "Birth Certificate", description: "For official proof of birth details." },
    { name: "Community Certificate", description: "For community-related verification and benefits." },
];

export default function ApplyService() {
    const [searchParams] = useSearchParams();
    const [service, setService] = useState(() => searchParams.get("service") || "");
    const [loading, setLoading] = useState(false);
    const selectedService = services.find((item) => item.name === service);

    async function handleApply() {
        if (!service) {
            alert("Please select a service");
            return;
        }

        try {
            setLoading(true);
            const response = await createApplication(service);
            alert(`Application created successfully. ID: ${response.id}`);
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to create application");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                    <section className="relative overflow-hidden rounded-3xl bg-blue-700 px-7 py-10 text-white shadow-lg shadow-blue-700/15 sm:px-10 lg:py-12">
                        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/60" />
                        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[26px] border-blue-500/40" />

                        <div className="relative">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                                <ClipboardCheck size={24} aria-hidden="true" />
                            </span>
                            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Certificate application</p>
                            <h1 className="mt-3 max-w-md text-4xl font-bold leading-tight">Start your application with confidence.</h1>
                            <p className="mt-5 max-w-md text-base leading-7 text-blue-100">
                                Select the certificate you need. We will create your application so you can track it from your account.
                            </p>

                            <div className="mt-10 space-y-4 border-t border-white/20 pt-6 text-sm text-blue-100">
                                <p className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-bold">1</span> Select a certificate service</p>
                                <p className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-bold">2</span> Submit your application</p>
                                <p className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-bold">3</span> Track its progress anytime</p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-9 lg:p-11">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <FileText size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Choose a service</h2>
                                <p className="mt-1 text-sm text-slate-500">You can apply for one certificate at a time.</p>
                            </div>
                        </div>

                        <label className="mt-8 block">
                            <span className="text-sm font-semibold text-slate-700">Certificate service</span>
                            <select
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                value={service}
                                onChange={(event) => setService(event.target.value)}
                            >
                                <option value="">Select a service</option>
                                {services.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                            </select>
                        </label>

                        <div className="mt-5 min-h-20 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                            {selectedService ? (
                                <div className="flex gap-3">
                                    <Info className="mt-0.5 shrink-0 text-blue-700" size={19} aria-hidden="true" />
                                    <div>
                                        <p className="font-semibold text-slate-800">{selectedService.name}</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">{selectedService.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm leading-6 text-slate-500">Select a certificate to view a short description before applying.</p>
                            )}
                        </div>

                        <button
                            onClick={handleApply}
                            disabled={loading || !service}
                            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-400"
                        >
                            {loading ? "Submitting application..." : <>Start application <ArrowRight size={18} aria-hidden="true" /></>}
                        </button>

                        <p className="mt-5 text-center text-xs leading-5 text-slate-500">You can review the application status in My Applications after submission.</p>
                    </section>
                </div>
            </main>
        </>
    );
}
