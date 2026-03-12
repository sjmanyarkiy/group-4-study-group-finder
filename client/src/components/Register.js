import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";


function Register({ onLogin }) {
    const history = useHistory();

    const formSchema = yup.object().shape({
        name: yup.string().required("Must enter a name"),
        dob: yup.string().required("Must enter date of birth"),
        email: yup.string().email("Invalid email").required("Must enter email"),
        national_id: yup.string().required("Must enter National ID").min(8, "National ID must be at least 8 characters"),
        phone_number: yup.string().required("Must enter a phone number").matches(/^0[0-9]{9}$/, "Phone number must be 10 digits starting with 0"),
        user_category: yup.string().oneOf(["student", "lecturer"], "Please select a valid category").required("Must select a category"),
        password: yup.string().required("Must enter a password").min(6, "Password must be at least 6 characters"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            dob: "",
            email: "",
            national_id: "",
            phone_number: "",
            user_category: "",
            password: ""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`${BASE_URL}/register`, {
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
        <div style={styles.container}>
            <h2>Create Account</h2>
            <form onSubmit={formik.handleSubmit} style={styles.form}>

                <label htmlFor="name">Full Name</label>
                <input 
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.name}</p>

                <label htmlFor="dob">Date of Birth</label>
                <input 
                    id="dob"
                    name="dob"
                    type="date"
                    onChange={formik.handleChange}
                    value={formik.values.dob}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.dob}</p>

                <label htmlFor="email">Email Address</label>
                <input 
                    id = "email"
                    name = "email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.email}</p>

                <label htmlFor="national_id">National ID</label>
                <input 
                    id = "national_id"
                    name = "national_id"
                    onChange={formik.handleChange}
                    value={formik.values.national_id}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.national_id}</p>

                <label htmlFor="phone_number">Phone Number</label>
                <input 
                    id = "phone_number"
                    name = "phone_number"
                    onChange={formik.handleChange}
                    value={formik.values.phone_number}
                    style={styles.input}
                />
                <p style={styles.error}>{formik.errors.phone_number}</p>

                <label htmlFor="user_category">Category</label>
                <select 
                    id = "user_category"
                    name = "user_category"
                    onChange={formik.handleChange}
                    value={formik.values.user_category}
                    style={styles.input}
                >
                    <option value="">Select a category</option>
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                </select>
                <p style={styles.error}>{formik.errors.user_category}</p>

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
    );



}

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
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

export default Register
