import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";


function Register({ onLogin }) {
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            name: "",
            dob: "",
            email: "",
            national_id: "",
            phone_number: "",
            user_category: "",
            password: ","
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/register", {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(values),
            })
            .then((res) => {
                if (res.ok) {
                    res.json()
                    .then((data) => {
                        onLogin(data);
                        history.push("/");
                    });
                }
                else {
                    res.json()
                    .then((data) => alert(data.error))
                }
            });
        },
    });

    return (
        <div>
            <h2>Create Account</h2>
            <form onSubmit={formik.handleSubmit}>

                <label htmlFor="name">Full Name</label>
                <input 
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                />
                <p>{formik.errors.name}</p>

                <label htmlFor="dob">Date of Birth</label>
                <input 
                    id="dob"
                    name="dob"
                    type="date"
                    onChange={formik.handleChange}
                    value={formik.values.dob}
                />
                <p>{formik.errors.dob}</p>

                <label htmlFor="email">Email Address</label>
                <input 
                    id = "email"
                    name = "email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <p>{formik.errors.email}</p>

                <label htmlFor="national_id">National ID</label>
                <input 
                    id = "national_id"
                    name = "national_id"
                    onChange={formik.handleChange}
                    value={formik.values.national_id}
                />
                <p>{formik.errors.national_id}</p>

                <label htmlFor="phone_number">Phone Number</label>
                <input 
                    id = "phone_number"
                    name = "phone_number"
                    onChange={formik.handleChange}
                    value={formik.values.phone_number}
                />
                <p>{formik.errors.phone_number}</p>

                <label htmlFor="user_category">Category</label>
                <select 
                    id = "user_category"
                    name = "user_category"
                    onChange={formik.handleChange}
                    value={formik.values.user_category}
                >
                    <option value="">Select a category</option>
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                </select>
                <p>{formik.errors.user_category}</p>

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.password}</p>

                <button type="submit" style={styles.button}>Register</button>

            </form>
        </div>
    )



}

export default Register
