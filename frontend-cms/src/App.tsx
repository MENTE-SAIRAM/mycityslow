import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CitiesPage from './pages/CitiesPage';
import SpotsPage from './pages/SpotsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import HelpPage from './pages/HelpPage';

function App() {
    const { token } = useAuth();

    if (!token) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <div className="flex min-h-screen bg-dark-950">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <Routes>
                    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/cities" element={<ProtectedRoute><CitiesPage /></ProtectedRoute>} />
                    <Route path="/spots" element={<ProtectedRoute><SpotsPage /></ProtectedRoute>} />
                    <Route path="/submissions" element={<ProtectedRoute><SubmissionsPage /></ProtectedRoute>} />
                    <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
