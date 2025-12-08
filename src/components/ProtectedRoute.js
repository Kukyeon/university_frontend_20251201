import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, roleRequired, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roleRequired && role !== roleRequired) {
    // 권한이 맞지 않으면
    return <div>접근 권한이 없습니다.</div>;
  }
  return children;
};

export default ProtectedRoute;
