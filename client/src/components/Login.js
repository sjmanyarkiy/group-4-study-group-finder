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
        <div>
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input 
                    id = "email"
                    name = "email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <p>{formik.errors.email}</p>

                <label htmlFor="password">Password</label>
                <input 
                    id = "password"
                    name = "password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <p>{formik.errors.password}</p>

                <button type="submit">LogIn</button>
            </form>
        </div>
    )

}

export default Login
