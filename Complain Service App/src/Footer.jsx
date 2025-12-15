import React from "react";

const Footer = () => (
  <footer>
    <div className="footer-inner">
      <span>© {new Date().getFullYear()} Complaint Service App</span>
      <span className="footer-separator">•</span>
      <span>Built with React</span>
    </div>
  </footer>
);

export default Footer;


