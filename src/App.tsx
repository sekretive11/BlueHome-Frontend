import "./App.css";

import { type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { server } from "./api";

import {
    AuthPage,
    DevicePage,
    DevicesPage,
    HomePage,
    NotFound,
    ProfilePage,
    RoomsPage,
    SpacePage,
} from "./pages";

type RouteGuardProps = {
    children: ReactNode;
};

const PrivateRoute = ({ children }: RouteGuardProps) => {
    const isAuth = Boolean(server.getAccessToken());

    return isAuth ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }: RouteGuardProps) => {
    const isAuth = Boolean(server.getAccessToken());

    return isAuth ? <Navigate to="/home" replace /> : children;
};

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />

                    <Route
                        path="/auth"
                        element={
                            <PublicRoute>
                                <AuthPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/rooms"
                        element={
                            <PrivateRoute>
                                <RoomsPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/spaces"
                        element={
                            <PrivateRoute>
                                <SpacePage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/device/:id"
                        element={
                            <PrivateRoute>
                                <DevicePage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/devices"
                        element={
                            <PrivateRoute>
                                <DevicesPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <PrivateRoute>
                                <NotFound />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
