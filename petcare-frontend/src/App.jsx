import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdoptionList from "./pages/AdoptionList";
import Vaccines from "./pages/Vaccines";
import Chat from "./pages/Chat";
import PetDetails from "./pages/PetDetails";
import LostPets from "./pages/LostPets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        <Route path="/adoption/:type" element={<AdoptionList />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="/chat/:room" element={<Chat />} />
        <Route path="/pet/:id" element={<PetDetails />} />

        
        <Route path="/lost-pets" element={<LostPets />} />

        
        <Route path="/lost-pets/new" element={<Navigate to="/lost-pets" replace />} />
        <Route path="/lost-pets/search" element={<Navigate to="/lost-pets" replace />} />
        <Route path="/lost-pets/list" element={<Navigate to="/lost-pets" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
