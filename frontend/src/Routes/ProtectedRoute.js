import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {

    const { loading, isAuthenticated, user } = useSelector(state => state.user);

    // 🔥 IMPORTANT: wait for loading
    if (loading) return null;

    // 🔥 not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 🔥 admin check
    if (isAdmin && user?.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;