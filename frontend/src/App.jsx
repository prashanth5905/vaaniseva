import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ApplyService from "./pages/apply/ApplyService";
import Documents from "./pages/documents/Documents";
import ApplicationDetails from "./pages/application/ApplicationDetails";
function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route 
                    path="/" 
                    element={<Login />} 
                />

                <Route 
                    path="/dashboard" 
                    element={<Dashboard />} 
                />

                <Route 
                    path="/apply"
                    element={<ApplyService/>}
                />

                <Route 
                    path="/documents"
                    element={<Documents/>}
                />

                <Route
                    path="/applications/:id"
                    element={<ApplicationDetails />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;