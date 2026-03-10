import React from react;
import { Link } from react-router-dom;


function Navbar({ user, onLogout}){
    return (
        <nav>
            <div>
                <Link to="/">StudyGroups</Link>
            </div>
            <div>
                <Link to="/">Home</Link>
                ( user ? (
                    <>
                        <span> Hello, {user.name}</span>
                        <button onClick={onLogout} >Logout</button>
                    </>
                )) : (
                    <>
                        <Link to="/login">Log In</Link>
                        <Link to="/register">Register</Link>
                    </>
                )
            </div>
        </nav>
    )
}
