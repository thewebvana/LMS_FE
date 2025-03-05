import Layout from "@/layout";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Classrooms from "@/pages/settings/classrooms";
import Users from "@/pages/settings/users";
import Signup from "@/pages/signup";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";

const RedirectToLogin = () => {
	return (
		<>
			<Navigate to="/" />
		</>
	);
};

function AppRouter() {
	const [isLogin, setIslogin] = useState(true);

	return (
    <Router>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        {isLogin ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings/users" element={<Users />} />
            <Route path="/settings/classrooms" element={<Classrooms />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </ThemeProvider>
  </Router>
	);
}

export default AppRouter;
