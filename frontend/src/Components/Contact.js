import React, { Component, useEffect } from "react";
import "./Contact.css";
import { useState } from "react";
import Swal from 'sweetalert2'
import axios from "axios";
import { auth } from "../firebase";  // Ensure correct path
import CryptoJS from "crypto-js"; // Import CryptoJS
const secretKey = process.env.REACT_APP_SECRET_KEY || "defaultSecret";


function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const token = await auth.currentUser.getIdToken(); // Get Firebase Auth Token
  
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(formData),
      secretKey
    ).toString();
  
    try {
      await axios.post("http://localhost:5000/api/contact", { encryptedData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      Swal.fire({ title: "Message Sent!", icon: "success" });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message.");
    }
  };
  
  

  return (
    <div className="contactsection">
      <div className="title">
        <h1>Contact Us</h1>
      </div>

      <div className="Main">
        {/* action='https://formspree.io/f/xkgnwekr' */}
        <form onSubmit={sendEmail} className="ContactForm">
          <div>
            {/* <label>Name: </label> */}
            <input
              type="text"
              name="name" // Ensure this matches state keys
              id="Name"
              placeholder="User Name"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            {/* <label>Email:</label> */}
            <input
              type="email"
              name="email"
              id="Email"
              placeholder="Email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            {/* <label>Phone:</label> */}
            <input
              type="tel"
              name="phone"
              id="Phone"
              placeholder="Phone No."
              maxLength="10"
              pattern="[0-9]{10}"
              autoComplete="off"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            {/* <label>Message:</label> */}
            <textarea
              name="message"
              id="Message"
              placeholder="Message"
              cols="30"
              rows="5"
              autoComplete="off"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <input type="submit" value="send" className="btn btn-primary" />
        </form>
      </div>
    </div>
  );
}

export default Contact;

/**
 * 
 * 
 * const sendEmail = (event) => {
        event.preventDefault();
        
        // Using the globally available Email object from smtpjs
        window.Email.send({
            Host: "smtp.gmail.com",
            Username: "precisionfarming909@gmail.com",
            Password: "Precision@909",
            To: "precisionfarming909@gmail.com",
            From: document.getElementById('Email').value,
            Subject: "New Contact Form Enquiry From " + document.getElementById('Name').value + ".",
            Body: `
                Name: ${document.getElementById('Name').value}
                <br/> Email: ${document.getElementById('Email').value}
                <br/> Phone No.: ${document.getElementById('Phone').value}
                <br/> Message: ${document.getElementById('Message').value}
            `,
        }).then(
            () => alert("Message Sent Successfully.")
        ).catch(error => {
            alert("Failure in message sending!");
            console.error(error); // Log errors for easier debugging
        });
    };

 */
