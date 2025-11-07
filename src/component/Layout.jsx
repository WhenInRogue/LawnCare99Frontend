import React from "react";
import Sidebar from "./Sidebar";

//.jsx file is a way to write HTML-like code within JavaScript

//creates the structure of our pages and sidebar will always be there
                //can change children to page if i want to
const Layout = ({children}) =>{
    return(
        <div className="layout">
            <Sidebar/>
            <div className="main-content">
                {children}
            </div>
        </div>
    );
}

export default Layout;