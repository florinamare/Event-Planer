import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/SignInSignUp.css";
import { useContext } from "react";

function SignInSignUp() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [wantOrganizer, setWantOrganizer] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate("/events");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Eroare la autentificare.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirm) {
      return alert("Parolele nu coincid.");
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: registerName,
          role: wantOrganizer ? "pending_organizer" : "user",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Cont creat cu succes. Te poți autentifica acum.");
        setIsLogin(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Eroare la înregistrare.");
    }
  };

  return (
    <section className="forms-section">
      <h1 className="section-title">Autentificare & Înregistrare</h1>
      <div className="forms">
        {/* Login Form */}
        <div className={`form-wrapper ${isLogin ? "is-active" : ""}`}>
          <button
            type="button"
            className="switcher switcher-login"
            onClick={() => setIsLogin(true)}
          >
            Login
            <span className="underline"></span>
          </button>
          <form className="form form-login" onSubmit={handleLogin}>
            <fieldset>
              <legend>Introdu email și parolă pentru login.</legend>
              <div className="input-block">
                <label htmlFor="login-email">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Parolă</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </fieldset>
            <button type="submit" className="btn-login">
              Autentificare
            </button>
          </form>
        </div>

        {/* Register Form */}
        <div className={`form-wrapper ${!isLogin ? "is-active" : ""}`}>
          <button
            type="button"
            className="switcher switcher-signup"
            onClick={() => setIsLogin(false)}
          >
            Sign Up
            <span className="underline"></span>
          </button>
          <form className="form form-signup" onSubmit={handleSignup}>
            <fieldset>
              <legend>Completează datele pentru înregistrare.</legend>

              <div className="input-block">
                <label htmlFor="signup-name">Nume complet</label>
                <input
                  id="signup-name"
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>

              <div className="input-block">
                <label htmlFor="signup-email">E-mail</label>
                <input
                  id="signup-email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-block">
                <label htmlFor="signup-password">Parolă</label>
                <input
                  id="signup-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-block">
                <label htmlFor="signup-password-confirm">Confirmă parola</label>
                <input
                  id="signup-password-confirm"
                  type="password"
                  value={registerConfirm}
                  onChange={(e) => setRegisterConfirm(e.target.value)}
                  required
                />
              </div>

              <div className="input-block">
                <label>
                  <input
                    type="checkbox"
                    checked={wantOrganizer}
                    onChange={(e) => setWantOrganizer(e.target.checked)}
                  />{" "}
                  Vreau să fiu organizator
                </label>
              </div>
            </fieldset>
            <button type="submit" className="btn-signup">
              Înregistrare
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignInSignUp;
