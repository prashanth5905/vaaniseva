import { useEffect, useState } from "react";
import {
    getCitizenProfile,
    getCitizenApplications
} from "../../services/citizenService";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard(){

    const [profile,setProfile] = useState(null);
    const [applications,setApplications] = useState([]);


    useEffect(()=>{

        async function load(){

            try{

                const user =
                    await getCitizenProfile();

                const apps =
                    await getCitizenApplications();


                setProfile(user);
                setApplications(apps);


            }catch(error){

                console.log(error);

            }

        }


        load();

    },[]);



    return(
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100">
                

                <div className="min-h-screen bg-slate-100 p-10">

                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">


                        <h1 className="text-3xl font-bold text-blue-600">
                            Welcome {profile?.name}
                        </h1>


                        <p className="mt-2 text-gray-600">
                            Citizen Dashboard
                        </p>



                        {profile && (

                            <div className="mt-6">

                                <h2 className="text-xl font-semibold">
                                    Profile
                                </h2>

                                <p>
                                    Aadhaar:
                                    {profile.aadhaar_number}
                                </p>


                                <p>
                                    District:
                                    {profile.district}
                                </p>


                            </div>

                        )}



                        <div className="mt-8">

                            <h2 className="text-xl font-semibold">
                                My Applications
                            </h2>


                            {
                            applications.map((app) => (

                                <Link
                                    key={app.id}
                                    to={`/applications/${app.id}`}
                                >

                                    <div className="border rounded-lg p-4 mb-4 hover:bg-slate-100">

                                        <p>

                                            <strong>Service:</strong>

                                            {app.service_name}

                                        </p>

                                        <p>

                                            <strong>Status:</strong>

                                            {app.status}

                                        </p>

                                    </div>

                                </Link>

                            ))}
                        


                        </div>


                    </div>

                </div>

            </div>
        </>

    );

}