import Layout from "@/layout";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Classrooms from "@/pages/settings/classrooms";
import Users from "@/pages/settings/users";
import Signup from "@/pages/signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";


function AppRouter() {


  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings/users" element={<Users />} />
          <Route path="/settings/classrooms" element={<Classrooms />} />
        </Routes>

      </Layout>
    </Router >
  );
}

export default AppRouter;
