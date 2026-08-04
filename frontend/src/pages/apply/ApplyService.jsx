import { useState } from "react";
import { createApplication } from "../../services/applicationService";


export default function ApplyService() {

    const [service, setService] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleApply() {

        if (!service) {
            alert("Please select a service");
            return;
        }


        try {

            setLoading(true);

            const response = await createApplication(service);

            console.log(response);

            alert(
                `Application created successfully. ID: ${response.id}`
            );


        } catch(error) {

            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Failed to create application"
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="min-h-screen bg-slate-100 p-10">

            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-blue-600">
                    Apply For Service
                </h1>


                <select
                    className="w-full mt-6 border rounded-lg p-3"
                    value={service}
                    onChange={(e)=>setService(e.target.value)}
                >

                    <option value="">
                        Select Service
                    </option>

                    <option value="Income Certificate">
                        Income Certificate
                    </option>

                    <option value="Residence Certificate">
                        Residence Certificate
                    </option>

                    <option value="Birth Certificate">
                        Birth Certificate
                    </option>

                    <option value="Community Certificate">
                        Community Certificate
                    </option>

                </select>


                <button
                    onClick={handleApply}
                    disabled={loading}
                    className="w-full mt-5 bg-blue-600 text-white p-3 rounded-lg"
                >
                    {
                        loading 
                        ? "Submitting..."
                        : "Apply"
                    }
                </button>


            </div>

        </div>

    );
}