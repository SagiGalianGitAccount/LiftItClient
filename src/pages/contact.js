import React from "react";
import "../static/css/contact.css";

function Contact(props) {
  return (
    <div className="contact-container">
      <div className="login-box">
        <form style={{display: 'flex', textAlign:'center', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
          <h2>Contact Us</h2>

          <h6>
            If you have any queries or suggestions to enhance our website's
            quality, please do not hesitate to contact us. We welcome all
            feedback and will make every effort to address your concerns and
            implement any valuable ideas to improve your browsing experience.
            So, feel free to send us a message, and we'll strive to provide you
            with the best possible service.
          </h6>
          <h6>
            <a href="mailto:liftit.contact@gmail.com">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              liftit.contact@gmail.com
            </a>
          </h6>
        </form>
      </div>

      <button
        className="btn btn-danger"
        onClick={() => {
          props.setContacting(false);
        }}
      >
        Go Back
      </button>
    </div>
  );
}

export default Contact;
