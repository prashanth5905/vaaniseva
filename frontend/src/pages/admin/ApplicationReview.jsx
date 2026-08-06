import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getApplicationDetails,
    approveApplication,
    rejectApplication,
} from "../../services/adminService";

import {
    downloadDocument
} from "../../services/adminService";


export default function ApplicationReview() {

    const { id } = useParams();

    const [application, setApplication] = useState(null);



    useEffect(() => {

        loadApplication();

    }, []);



    async function loadApplication() {

        try {

            const data =
                await getApplicationDetails(id);
            console.log("APPLICATION DETAILS:", data);
            setApplication(data);

        }
        catch (error) {

            alert(
                "Failed to load application"
            );

        }

    }



    async function approve() {

        try {

            await approveApplication(id);

            alert(
                "Application approved"
            );

            loadApplication();

        }
        catch (error) {

            alert(
                "Approval failed"
            );

        }

    }



    async function reject() {

        try {

            await rejectApplication(id);

            alert(
                "Application rejected"
            );

            loadApplication();

        }
        catch (error) {

            alert(
                "Rejection failed"
            );

        }

    }



    if (!application)
        return <h1>Loading...</h1>;



    return (

        <>
            <Navbar />


            <div className="min-h-screen bg-slate-100 flex justify-center">


                <div className="bg-white mt-10 p-8 rounded-xl shadow w-full max-w-4xl">


                    <h1 className="text-3xl font-bold text-blue-600">
                        Application Review
                    </h1>


                    <div className="mt-6 space-y-3">


                        <p>
                            <b>ID:</b> {application.application.id}
                        </p>


                        <p>
                            <b>Service:</b> {application.application.service_name}
                        </p>


                        <p>
                            <b>Status:</b> {application.application.status}
                        </p>

                        <hr className="my-6" />


                        <h2 className="text-2xl font-bold text-blue-600">
                            Citizen Details
                        </h2>


                        <div className="mt-4 space-y-2">

                            <p>
                                <b>Name:</b> {application.citizen.name}
                            </p>


                            <p>
                                <b>Aadhaar:</b> {application.citizen.aadhaar_number}
                            </p>


                            <p>
                                <b>Phone:</b> {application.citizen.registered_phone}
                            </p>


                            <p>
                                <b>District:</b> {application.citizen.district}
                            </p>

                        </div>

                        <hr className="my-6" />


                        <h2 className="text-2xl font-bold text-blue-600">
                            Uploaded Documents
                        </h2>


                        <div className="mt-4 space-y-3">


                            {
                                application.documents.map((doc) => (

                                    <div
                                        key={doc.id}
                                        className="border rounded p-4"
                                    >

                                        <p>
                                            <b>File:</b> {doc.file_name}
                                        </p>


                                        <button
                                            onClick={() => downloadDocument(doc.id)}
                                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                                        >
                                            View Document
                                        </button>


                                    </div>

                                ))
                            }


                        </div>


                    </div>



                    {
                        application.application.status === "pending" &&

                        <div className="mt-8 flex gap-5">


                            <button
                                onClick={approve}
                                className="bg-green-600 text-white px-6 py-3 rounded"
                            >
                                Approve
                            </button>


                            <button
                                onClick={reject}
                                className="bg-red-600 text-white px-6 py-3 rounded"
                            >
                                Reject
                            </button>


                        </div>

                    }


                </div>


            </div>


        </>

    );

}