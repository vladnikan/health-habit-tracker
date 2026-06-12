import { useEffect } from "react";
import "./App.css";
import { Habits } from "./pages/habits/Habits";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { useAppDispatch } from "./hooks/hooks";
import { initAuth } from "./store/auth/initAuth";
import { Register } from "./pages/register/Register";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { Analysis } from "./pages/analysis/Analysis";
import { Health } from "./pages/health/Health";
import { ProtectedRoute } from "./components/protectedRoute/Protectedroute";
import { NotFound } from "./pages/notFound/NotFound";
import { Profile } from "./pages/profile/Profile";
import { Layout } from "./components/layout/Layout";


function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, []);

  return (
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />}/>
        <Route path="/habits" element={<ProtectedRoute element={<Habits />} />} />
        <Route path="/analysis" element={<ProtectedRoute element={<Analysis/>} />}/>
        <Route path="/health" element={<ProtectedRoute element={<Health/>}/>}/>
        <Route path="/profile" element={<ProtectedRoute element={<Profile/>}/>}/>
      </Route>

      <Route path="/register" element={<ProtectedRoute onlyUnAuth element={<Register />} />} />
      <Route path="/login" element={<ProtectedRoute onlyUnAuth element = {<Login />} />} />
      <Route path="*" element = {<ProtectedRoute element={<NotFound/>}/>}/>
    </Routes>
  );
}

export default App;
