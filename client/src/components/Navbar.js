import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }){
    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <Link to="/" style={styles.brandLink}>LetsStudy!</Link>
            </div>
            <div style={styles.links}>
                <Link to="/" style={styles.link}>Home</Link>
                { user ? (
                    <>
                        <span style={styles.welcome}>Hi, {user?.name?.split(" ")[0]}!</span>
                        {user.user_category === "student" && (
                            <>
                                <Link to="/memberships" style={styles.link}>My Memberships</Link>
                                <Link to="/memberships/new" style={styles.link}>Join a Group</Link>
                            </>
                        )}
                        {user.user_category === "lecturer" && (
                            <Link to="/groups/new" style={styles.link}>Create Group</Link>
                        )}
                        <button onClick={onLogout} style={styles.button}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Log In</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 32px",
    backgroundColor: "#2E4057",
    color: "white",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  brandLink: {
    color: "white",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  },
  welcome: {
    color: "#ccc",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "6px 14px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Navbar;