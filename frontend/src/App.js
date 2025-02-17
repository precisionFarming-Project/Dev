import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, provider } from "./firebase"; // ✅ Firebase imports
import Header1 from "./Components/Header1"; // ✅ Header Component
import Slide from "./Components/Slide";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import About from "./Components/About";
import HowItWorks from "./Components/HowItWorks";
import Testimonial from "./Components/Testimonial";
import Dashboard from "./Components/Dashboard"; // ✅ Dashboard Component
import AuthComponent from "./Components/AuthComponent"; // ✅ Separate Auth Component
import Signup from "./Components/Signup"; // ✅ Signup Component
import  HomeShimmer from "./HomeShimmer";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // ✅ Listen for authentication state changes
  //   const unsubscribe = auth.onAuthStateChanged((currentUser) => {
  //     setUser(currentUser);
  //   });

  //   return () => unsubscribe(); // ✅ Cleanup function
  // }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);  // ✅ Set the authenticated user
      setLoading(false); // ✅ Set loading to false when auth state resolves
    });
  
    return () => unsubscribe(); // ✅ Cleanup function
  }, []);
  

  const handleGoogleSignIn = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };


  if (loading) {
    return <HomeShimmer />; // ✅ Show shimmer for the whole app
  }

  return (
    <Router>
      <div className="App">
        <Header1 /> {/* ✅ Keep header consistent on all pages */}

        <div className="MainContent">
          <Routes>
            {/* ✅ Home Route */}
            <Route
              path="/"
              element={
                <>
                  <Slide />
                  <HowItWorks />
                  <About />
                  <Testimonial />
                </>
              }
            />

            {/* ✅ Signup Page */}
            <Route path="/signup" element={<Signup />} />

            {/* ✅ Contact Page */}
            <Route path="/contact" element={<Contact />} />

            {/* ✅ Authentication Page */}
            <Route path="/auth" element={<AuthComponent />} />

            {/* ✅ Dashboard Route - Only for logged-in users */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard user={user} /> // ✅ Show Dashboard if logged in
                ) : (
                  <div className="auth-container">
                    <p>Please sign in to access the dashboard.</p>
                    <button className="btn btn-primary" onClick={handleGoogleSignIn}>
                      Sign in with Google
                    </button>
                  </div>
                )
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
