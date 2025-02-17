import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheatAwn, faBars } from "@fortawesome/free-solid-svg-icons";
import "./Header1.css";
import { Link } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import SignOutDialog from "./SignOutDialog";

function Header1() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Add menu state
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="Header">
      <nav>
        <div className="logo-container">
          <Link to="/">
            <FontAwesomeIcon icon={faWheatAwn} className="logoicon" />
          </Link>
          <h2>Precision Farming</h2>
        </div>

        {/* ✅ Hamburger Menu */}
        <FontAwesomeIcon icon={faBars} className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} />

        {/* ✅ Navbar Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/getstarted" onClick={() => setMenuOpen(false)}>Get Started</Link></li>
          <li><Link to="/history" onClick={() => setMenuOpen(false)}>View History</Link></li>
          <li><Link to="/features" onClick={() => setMenuOpen(false)}>Features</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>


        </ul>

        {/* ✅ Authentication Section */}
        {user ? (
          <div className="user-info">
            <Avatar alt="User" src={user?.photoURL || "https://via.placeholder.com/30"} sx={{ width: 30, height: 30 }} />
            <span>{user.displayName}</span>
            <Button className="btn btn-danger" onClick={() => setOpenDialog(true)}>Logout</Button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="btn btn-primary" onClick={handleGoogleSignIn}>Sign In</button>
            <button className="btn btn-secondary" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}
      </nav>

      {/* ✅ Sign-Out Dialog */}
      <SignOutDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </div>
  );
}

export default Header1;
