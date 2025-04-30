"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { setEmail } from "../../../../redux/reducers/slice/authSlice";
import { useLazyCheckEmailQuery } from "../../../../services/auth/auth";

const Carousel = () => {
    const [isShow, setIsShow] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [checkEmail] = useLazyCheckEmailQuery();

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
            }
            try {
                const response = await checkEmail(payload).unwrap();
                if (response?.data?.isUnique) {
                    toast.success(response?.message);
                    dispatch(setEmail(values.email));
                    router.push("/personal-details");
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
                <h1 className="welcome-auth-title">bienvenido</h1>
                <button className="google-login-btn">
                    <img src="/images/google_icon.svg" className="mr-2" alt="google-login" />
                    Continuar con Google
                </button>
                <button className="apple-login-btn">
                    <img src="/images/apple_icon.svg" className="mr-2" alt="google-login" />
                    Continuar con Apple
                </button>
                <button className="google-login-btn" onClick={() => setIsShow(!isShow)}>
                    Continuar con correo electrónico
                </button>
                <div className="signup-form">
                    {isShow && (
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

                            <button className="main-button my-3" type="submit">Ponerse en marcha</button>
                        </form>
                    )}
                </div>

                <p className="login-text">¿Ya tienes una cuenta? <Link href="/login" className="login-signup-link">Inciar sesión</Link></p>
            </div>
        </div >
    );
};

export default Carousel;
