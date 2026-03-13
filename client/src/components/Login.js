import React from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from 'react-router-dom';

function Login( { onLogin }) {
    const history = useHistory();

    const formSchema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Must enter email"),
        password: yup.string().required("Must enter password")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(values),
            }).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        onLogin(data);
                        history.push("/");
                    });
                } else {
                    res.json().then((data) => alert(data.error))
                }
            });
        },
    });

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit} style={styles.form}>
                <label htmlFor="email">Email Address</label>
                <input 
                    id = "email"
                    name = "email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.email}</p>

                <label htmlFor="password">Password</label>
                <input 
                    id = "password"
                    name = "password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.password}</p>

                <button type="submit" style={styles.button}>LogIn</button>
            </form>
        </div>
    );
}


const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "8px",
    marginTop: "4px",
    marginBottom: "2px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "8px",
    minHeight: "16px",
  },
  button: {
    marginTop: "12px",
    padding: "10px",
    backgroundColor: "#2E4057",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login
