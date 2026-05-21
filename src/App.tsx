import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
    DevicePage,
    HomePage,
    ProfilePage,
    RoomsPage,
    SpacePage,
} from "./pages";

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />

                    <Route path="/home" element={<HomePage />} />

                    <Route path="/rooms" element={<RoomsPage />} />

                    <Route path="/profile" element={<ProfilePage />} />

                    <Route path="/spaces" element={<SpacePage />} />

                    <Route path="/device" element={<DevicePage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
