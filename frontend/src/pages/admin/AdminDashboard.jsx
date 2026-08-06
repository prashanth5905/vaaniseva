import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
    getPendingApplications
} from "../../services/adminService";


export default function AdminDashboard(){
    const navigate = useNavigate();
    const [applications,setApplications] = useState([]);


    useEffect(()=>{

        loadApplications();

    },[]);



    async function loadApplications(){

        try{

            const data = await getPendingApplications();

            setApplications(data);

        }
        catch(error){

            alert(
                error.response?.data?.detail ||
                "Failed to load applications"
            );

        }

    }


    return (

        <>
        <Navbar/>

        <div className="min-h-screen bg-slate-100 flex justify-center">

            <div className="w-full max-w-5xl bg-white mt-10 p-8 rounded-xl shadow">


                <h1 className="text-3xl font-bold text-blue-600">
                    Admin Dashboard
                </h1>


                <h2 className="text-xl font-bold mt-6">
                    Pending Applications
                </h2>



                <div className="mt-5 space-y-4">


                {
                    applications.map((app)=>(

                        <div
                        key={app.id}
                        className="border rounded-lg p-5"
                        >

                            <p>
                                <b>ID:</b> {app.id}
                            </p>

                            <p>
                                <b>Service:</b> {app.service_name}
                            </p>

                            <p>
                                <b>Status:</b> {app.status}
                            </p>


                            <button
                            onClick={() =>
                                navigate(`/admin/applications/${app.id}`)
                            }
                            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded"
                            >
                                Review
                            </button>


                        </div>


                    ))
                }


                </div>


            </div>


        </div>

        </>

    );
}