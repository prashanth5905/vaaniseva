import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import {
    getDocuments,
    uploadDocument,
} from "../../services/documentService";

export default function Documents() {

    const [documents, setDocuments] = useState([]);

    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState("");

    useEffect(() => {
        loadDocuments();
    }, []);

    async function loadDocuments() {
        try {
            const data = await getDocuments();

            console.log("Documents:", data);

            setDocuments(data);
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.detail ||
                "Failed to load documents"
            );
        }
    }

    async function handleUpload() {

        if (!file || !documentType) {
            alert("Select document type and file.");
            return;
        }

        try {

            await uploadDocument(
                file,
                documentType
            );

            alert("Document uploaded.");

            setFile(null);
            setDocumentType("");

            loadDocuments();

        } catch (error) {

            alert(
                error.response?.data?.detail ||
                "Upload failed."
            );

        }

    }

    return (

        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100">
                
            

            <div className="min-h-screen bg-slate-100 flex justify-center">

                <div className="w-full max-w-4xl bg-white mt-10 p-8 rounded-xl shadow">

                    <h1 className="text-3xl font-bold text-blue-600">
                        My Documents
                    </h1>

                    <div className="mt-6 space-y-3">

                        <select
                            value={documentType}
                            onChange={(e) =>
                                setDocumentType(e.target.value)
                            }
                            className="w-full border rounded-lg p-3"
                        >

                            <option value="">
                                Select Document Type
                            </option>

                            <option>Aadhaar Card</option>
                            <option>Birth Certificate</option>
                            <option>Income Certificate</option>
                            <option>Residence Certificate</option>
                            <option>Community Certificate</option>

                        </select>

                        <input
                            type="file"
                            onChange={(e) =>
                                setFile(e.target.files[0])
                            }
                        />

                        <button
                            onClick={handleUpload}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Upload
                        </button>

                    </div>


                    <div className="mt-6 space-y-4">

                        {documents.map((doc) => (

                            <div
                                key={doc.id}
                                className="border rounded-lg p-4"
                            >

                                <p>
                                    <strong>Type:</strong> {doc.document_type}
                                </p>

                                <p>
                                    <strong>File:</strong> {doc.file_name}
                                </p>

                                <p>
                                    <strong>Uploaded:</strong> {doc.uploaded_at}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </div>
        </>
    );
}