import {useState} from "react";
import {createApplication} from "../../services/applicationService";
import Navbar from "../../components/Navbar";

export default function ApplyService(){

    const [service,setService] = useState("");

    async function handleApply(){

        if(!service){
            alert("Select a service");
            return;
        }


        try{

            const result =
                await createApplication(service);


            alert(
                "Application created. ID: "
                + result.id
            );


        }
        catch(error){

            alert(
                error.response?.data?.detail ||
                "Failed"
            );

        }

    }



    return(

        <>
            <Navbar />

            <div className="min-h-screen bg-slate-100">
            
        

                <div className="min-h-screen bg-slate-100 p-10">


                    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">


                        <h1 className="text-2xl font-bold text-blue-600">
                            Apply For Service
                        </h1>


                        <select
                        className="w-full mt-6 border p-3 rounded"
                        value={service}
                        onChange={(e)=>setService(e.target.value)}
                        >

                            <option value="">
                                Select Service
                            </option>

                            <option>
                                Income Certificate
                            </option>

                            <option>
                                Residence Certificate
                            </option>

                            <option>
                                Birth Certificate
                            </option>

                            <option>
                                Community Certificate
                            </option>


                        </select>



                        <button
                        onClick={handleApply}
                        className="w-full mt-5 bg-blue-600 text-white p-3 rounded"
                        >

                            Apply

                        </button>


                    </div>


                </div>
            </div>
        </>

    );

}