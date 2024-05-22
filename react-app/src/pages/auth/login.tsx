import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            // Handle form submission
            console.log(values);
            // Add your login logic here, e.g., call an API to authenticate the user
        },
    });

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div>{formik.errors.password}</div>
                    ) : null}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;


