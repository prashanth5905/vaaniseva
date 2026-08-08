import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ApplyService from "./pages/apply/ApplyService";
import Documents from "./pages/documents/Documents";
import ApplicationDetails from "./pages/application/ApplicationDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicationReview from "./pages/admin/ApplicationReview";
import MyApplications from "./pages/citizen/MyApplications";
import ChatPage from "./pages/chat/ChatPage";
import Phone from "./pages/Phone";

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
                    path="/chat"
                    element={<ChatPage />}
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

                <Route
                    path="/admin"
                    element={<AdminDashboard/>}
                />

                <Route
                    path="/admin/applications/:id"
                    element={<ApplicationReview/>}
                />

                <Route
                    path="/applications"
                    element={<MyApplications/>}
                />
                <Route
                    path="/phone"
                    element={<Phone />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;
