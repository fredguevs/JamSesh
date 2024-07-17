import React from "react";
import NavBar from './NavBar.js'

function Header(){
    /*
        TODO:
        - Add logo later
        - Authentication, user is logged in
    */
    return (
        <>
            <h1>JamSesh</h1>
            
        </>
    )
}


export default function AppHeader(){
    return (
        <>
            <div className ='Header'>
                <Header />
            </div>
            <div className="NavBar">
                <NavBar />
            </div>
        </>
    )
}