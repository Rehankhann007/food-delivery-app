import { Navigate } from "react-router-dom";

export default function Admin() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
    </div>
  );
}