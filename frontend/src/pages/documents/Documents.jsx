import { useEffect, useState } from "react";
import { FileText, FolderOpen, ShieldCheck, Upload } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getDocuments, uploadDocument } from "../../services/documentService";

const documentTypes = [
    "Aadhaar Card",
    "Birth Certificate",
    "Income Certificate",
    "Residence Certificate",
    "Community Certificate",
];

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            alert(error.response?.data?.detail || "Failed to load documents");
        }
    }

    async function handleUpload() {
        if (!file || !documentType) {
            alert("Select document type and file.");
            return;
        }

        try {
            setIsUploading(true);
            await uploadDocument(file, documentType);
            alert("Document uploaded.");
            setFile(null);
            setDocumentType("");
            loadDocuments();
        } catch (error) {
            alert(error.response?.data?.detail || "Upload failed.");
        } finally {
            setIsUploading(false);
        }
    }

    function formatDate(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
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
                                    <FolderOpen size={18} aria-hidden="true" />
                                    Document centre
                                </div>
                                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">My Documents</h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                                    Keep the documents you need for government services organised and ready to use.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm ring-1 ring-white/15">
                                <span className="text-2xl font-bold">{documents.length}</span>
                                <span className="ml-2 text-blue-100">uploaded document{documents.length === 1 ? "" : "s"}</span>
                            </div>
                        </div>
                    </section>

                    <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <Upload size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Upload a document</h2>
                                <p className="mt-1 text-sm text-slate-500">Select its type, then choose the file from your device.</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr_auto] lg:items-end">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">Document type</span>
                                <select
                                    value={documentType}
                                    onChange={(event) => setDocumentType(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="">Select document type</option>
                                    {documentTypes.map((type) => <option key={type}>{type}</option>)}
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">File</span>
                                <input
                                    type="file"
                                    onChange={(event) => setFile(event.target.files[0] || null)}
                                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                                />
                            </label>

                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                <Upload size={17} aria-hidden="true" />
                                {isUploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </section>

                    <section className="mt-8">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Your uploaded documents</h2>
                                <p className="mt-1 text-sm text-slate-500">Documents available for your applications.</p>
                            </div>
                        </div>

                        {documents.length === 0 ? (
                            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                                <FileText className="mx-auto text-slate-400" size={32} aria-hidden="true" />
                                <h3 className="mt-4 font-semibold text-slate-800">No documents uploaded yet</h3>
                                <p className="mt-1 text-sm text-slate-500">Use the form above to add your first document.</p>
                            </div>
                        ) : (
                            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {documents.map((doc) => (
                                    <article key={doc.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                <FileText size={21} aria-hidden="true" />
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                <ShieldCheck size={13} aria-hidden="true" />
                                                Uploaded
                                            </span>
                                        </div>
                                        <p className="mt-5 text-sm font-semibold text-blue-700">{doc.document_type}</p>
                                        <h3 className="mt-1 break-words font-semibold text-slate-900">{doc.file_name}</h3>
                                        <p className="mt-3 text-sm text-slate-500">Uploaded {formatDate(doc.uploaded_at)}</p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
