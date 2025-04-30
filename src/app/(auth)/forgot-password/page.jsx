"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { setEmail } from "../../../../redux/reducers/slice/authSlice";
import { useLazyForgotpasswordQuery } from "../../../../services/auth/auth";

const ForgotPassword = () => {
    const [isShow, setIsShow] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [forgotPassword] = useLazyForgotpasswordQuery();

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Correo electrónico no válido")
                .required("El correo electrónico es obligatorio"),
        }),
        onSubmit: async (values) => {
            const payload = {
                email: values.email,
                isAccountResend: false
            }
            try {
                const response = await forgotPassword(payload).unwrap();
                if (response?.status) {
                    toast.success(response?.message);
                    localStorage.setItem('secretId', response?.data?.secretId);
                    dispatch(setEmail(values.email));
                    router.push("/reset-password");
                } else {
                    toast.error("Email already used");
                }
            } catch (err) {
                console.log("signup api error", err);
                toast.error(err?.data?.message || 'Algo salió mal');
            } finally {
                setSubmitting(false);
                resetForm();
            }
        },
    });

    return (
        <div className="p-5">
            <div className="login-div">
                <img src="/images/logo_dark.png" alt="logo" />
                <h1 className="forgot-title">Has olvidado tu contraseña</h1>
                <h4 className="text-primary-gray text-lg ">Restablece tu contraseña</h4>
                <div className="signup-form mt-6">
                    <form onSubmit={formik.handleSubmit}>
                        <h6 className="form-field-title">Correo electrónico</h6>
                        {/* <input type="email" name="email" placeholder="myemail@gmail.com" className="mt-2.5 mb-6 common-input" /> */}
                        <input
                            type="email"
                            name="email"
                            placeholder="myemail@gmail.com"
                            className="mt-2.5 mb-1 common-input"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="error-msg my-1">{formik.errors.email}</div>
                        )}
                        <button className="main-button my-6" type="submit">Ponerse en marcha</button>
                    </form>
                    <Link href="/login" className="flex justify-center forgot-pwd-link">Ir a iniciar sesión</Link>
                </div>
                {/* <p className="login-text">¿Ya tienes una cuenta? <Link href="/login" className="login-signup-link">Inciar sesión</Link></p> */}
            </div>
        </div >
    );
};

export default ForgotPassword;
