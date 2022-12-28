import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LoginForm from "../components/ui/loginForm";
import RegistrForm from "../components/ui/registrForm";

const Login = () => {
  const { type } = useParams();
  const [formType, setFormType] = useState(type === "registr" ? type : "login");

  const toggleFormType = () => {
    setFormType((prevstate) => (prevstate === "registr" ? "login" : "registr"));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="mt-5 col-md-6 offset-md-3 shadow p-4">
          {formType === "registr" ? (
            <>
              <h3 className="mb-4">Registr</h3>
              <RegistrForm />
              <p>
                Alredy have account?{" "}
                <a role="button" onClick={toggleFormType}>
                  Sign in
                </a>
              </p>
            </>
          ) : (
            <>
              <h3 className="mb-4">Login</h3>
              <LoginForm />
              <p>
                Dont have account?{" "}
                <a role="button" onClick={toggleFormType}>
                  Sign Up
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
