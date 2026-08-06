import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (

        <nav className="bg-blue-600 text-white shadow">

            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

                <Link
                    to="/dashboard"
                    className="text-2xl font-bold"
                >
                    VaaniSeva
                </Link>

                <div className="space-x-6">

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/apply">
                        Apply
                    </Link>

                    <Link to="/documents">
                        Documents
                    </Link>

                    <Link to="/applications">
                        My Applications
                    </Link>

                    <button
                        onClick={logout}
                        className="bg-red-500 px-3 py-1 rounded"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

}