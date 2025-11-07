import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";


//protects authenticated route
//if anyone is trying to access a protected route it will navigate them to the login screen
export const ProtectedRoute = ({element: Component}) => {
    const location = useLocation();
    return ApiService.isAuthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};

//protects admin routes
export const AdminRoute = ({element:Component}) => {
    const location = useLocation();
    return ApiService.isAdmin() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};
