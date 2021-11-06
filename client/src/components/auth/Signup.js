import React, { useState } from "react";

const Signup = () => {
  const [values, setValues] = useState({
    username: "admin10",
    email: "admin10@test.com",
    password: "admin",
    password2: "admin",
    displayname: "",
  });
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values }),
        })
          .then((response) => response.json())
          .then((errors) => setErrors(errors));
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const validate = () => {
    if (values["password"] !== values["password2"]) {
      setErrors({ ...errors, password: "Passwords do not match." });
      setIsValid(false);
    } else if (values["password"] === values["password2"]) {
      setIsValid(true);
    }
    return isValid;
  };

  return (
    <>
      <div className="container">
        <h3 className="mt-3 mb-4">Signup</h3>
        <form onSubmit={signupHandler}>
          <div className="w-75 form-floating mb-3">
            <input
              type="text"
              className="form-control"
              name="username"
              value={values["username"]}
              onChange={handleChange}
            />
            <label>
              Username
              <span className="required-input">*</span>
            </label>
            {errors.username && (
              <p className="text-danger">{errors.username}</p>
            )}
          </div>

          <div className="w-75 form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              value={values["email"]}
              onChange={handleChange}
            />
            <label>
              Email
              <span className="required-input">*</span>
            </label>
            {errors.email && <p className="text-danger">{errors.email}</p>}
          </div>

          <div className="w-75 form-floating mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              value={values["password"]}
              onChange={handleChange}
            />
            <label>
              Password
              <span className="required-input">*</span>
            </label>
          </div>

          <div className="w-75 form-floating mb-3">
            <input
              type="password"
              className="form-control"
              name="password2"
              value={values["password2"]}
              onChange={handleChange}
            />
            <label>
              Confirm Password
              <span className="required-input">*</span>
            </label>
            {errors["password"] && (
              <p className="text-danger">{errors["password"]}</p>
            )}
          </div>

          <div className="w-75">
            <button className="btn btn-primary btn-sm" disabled="">
              Signup
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;

