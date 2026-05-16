
import React, { useEffect } from "react";
import { isLoggedIn } from "./utils/localStorage";
import { useNavigate } from "react-router-dom";

import cube from "./assets/cube.gif";   // ✅ import gif

export default function Info() {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "EPB | Home";
  }, []);

  // ✅ When logged in → show cube
  if (isLoggedIn()) {
    return (
      <div className="home-dashboard">

        <img
          src={cube}
          alt="cube"
          className="cube-gif"
        />

      </div>
    );
  }

  return (
    <div className="landing-page">

      {/* HERO */}

      <section className="hero">

        <div className="hero-text">

          <h1>
            Evidence Protection System <br />
            Using <span>Blockchain</span>
          </h1>

          <p>
            Evidence-Protection System protects digital evidence using blockchain technology,
            ensuring tamper-proof verification and secure storage.
          </p>

          <div className="hero-buttons">

            <button
              className="btn btn-primary"
              onClick={() => navigate("/Login")}
            >
              Get Started
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                window.open(
                  "https://en.wikipedia.org/wiki/Blockchain",
                  "_blank"
                )
              }
            >
              Learn More
            </button>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="landing-footer">
        © 2026 Evidence Protection System Using Blockchain
      </footer>

    </div>
  );
}