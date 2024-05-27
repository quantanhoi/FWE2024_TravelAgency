import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../providers/authProvider';

const LoginPage: React.FC = () => {
    const { onLogin } = useAuth();

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
            onLogin(values); // Call onLogin with form values
        },
    });

    return (
        <div className='header flex-column'>
            <h1>Login</h1>
            <form onSubmit={formik.handleSubmit} className="form-grid">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        {...formik.getFieldProps('email')}
                        className="font-size-3vh transparent-background white-text white-border margin10 form-input"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="form-error">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...formik.getFieldProps('password')}
                        className="font-size-3vh transparent-background white-text white-border margin10 form-input"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="form-error">{formik.errors.password}</div>
                    ) : null}
                </div>
                <button 
                    type="submit"
                    className="font-size-3vh transparent-background white-text white-border margin10 form-button"
                >
                    Login
                </button>
            </form>
            <a href="/register" className='white-text margin10'>Not an user? Register here!</a>
        </div>
    );
};

export default LoginPage;