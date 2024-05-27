import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

export type RegisterUserData = {
    email: string;
    password: string;
    name: string;   
};

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const onRegister = async (registerData: RegisterUserData) => {
        try {
            const body = { email: registerData.email, password: registerData.password, name: registerData.name };
            const res = await fetch('http://localhost:3001/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if(!res.ok){
                alert('Registration failed');
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            else {
                alert('Registration successful');
                navigate('/login');
            }

            
        } catch (error) {
            alert('Registration failed');
            console.error('Error during registration:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            name: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
            name: Yup.string().required('Required'),  // Add name validation
        }),
        onSubmit: (values) => {
            const registerData: RegisterUserData = {
                email: values.email,
                password: values.password,
                name: values.name,
            };
            onRegister(registerData); // Call onRegister with transformed values
        },
    });

    return (
        <div className='header flex-column'>
            <h1>Register</h1>
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
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        id="name"
                        type="text"
                        {...formik.getFieldProps('name')}
                        className="font-size-3vh transparent-background white-text white-border margin10 form-input"
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="form-error">{formik.errors.name}</div>
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
                    Register
                </button>
            </form>
            <a href="/login" className='white-text margin10'>Already have an account? Log in here</a>
        </div>
    );
};

export default RegisterPage;
