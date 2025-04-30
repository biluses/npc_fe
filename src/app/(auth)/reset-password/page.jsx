"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { setEmail } from "../../../../redux/reducers/slice/authSlice";
import { useLazyForgotpasswordQuery, useLazyVerifyForgotCodeQuery } from "../../../../services/auth/auth";

const VerifyForgotCode = () => {
    const [isShow, setIsShow] = useState(false);
    const userEmail = useSelector((state) => state?.persistedReducer.user.email);
    var secretId = typeof window !== 'undefined' ? localStorage.getItem('secretId') : null;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const otpLength = 6;
    const otpRefs = Array(otpLength).fill().map(() => useRef(null));
    const [otp, setOtp] = useState(new Array(otpLength).fill(""));
    const [VerifyForgotCode] = useLazyVerifyForgotCodeQuery();
    const [forgotPassword] = useLazyForgotpasswordQuery();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        const value = element.value;
        setOtp(prevOtp => {
            const newOtp = [...prevOtp];
            newOtp[index] = value;
            if (value !== "" && index < otpLength - 1) {
                otpRefs[index + 1].current.focus();
            }
            return newOtp;
        });
    };

    const handleResend = async () => {
        let payload = {
            email: userEmail,
            isAccountResend: false
        };
        const response = await forgotPassword(payload).unwrap();
        if (response?.status) {
            toast.success(response?.message);
            secretId = response?.data?.secretId
        } else {
            toast.error("Email already used");
        }
    };

    const handleKeyDown = (element, index) => {
        if (element.key === "Backspace" && index > 0) {
            otpRefs[index - 1].current.focus();
        }
    };

    const formik = useFormik({
        initialValues: {
            email: userEmail,
            password: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Correo electrónico no válido")
                .required("El correo electrónico es obligatorio"),
            password: Yup.string().required("Contraseña requerida"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                .required("Confirma tu contraseña"),
        }),
        onSubmit: async (values) => {
            try {
                const otpCode = otp.join("");
                const response = await VerifyForgotCode({ secretId: secretId, forgotCode: otpCode, newPassword: values.password }).unwrap();

                if (response?.status) {
                    toast.success("Contraseña actualizada correctamente.");
                    localStorage.removeItem("secretId");
                    router.push("/login");
                } else {
                    toast.error(response?.message || "Algo salió mal");
                }
            } catch (err) {
                console.error("Error in resetting password", err);
                toast.error(err?.data?.message || 'Algo salió mal');
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
                        <p className="form-field-title">OTP</p>
                        <div className="otp-input-wrapper">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={otpRefs[index]}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyUp={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-primary-black text-lg font-medium flex ml-auto"
                        >
                            Reenviar
                        </button>

                        <p className="form-field-title">Elige una contraseña</p>
                        <div className="password-main-div">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Escribe tu contraseña"
                                className="common-input"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <img
                                src={showPassword ? "/images/visibility_icon.svg" : "/images/invisible_icon.svg"}
                                className="password-icon-img"
                                alt="password-icon"
                                onClick={() => setShowPassword(prev => !prev)}
                            />
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className="error-msg">{formik.errors.password}</div>
                        )}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="form-field-title"
                        >
                            Repite contraseña
                        </button>
                        <div className="password-main-div">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Repite tu contraseña"
                                className="common-input"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <img
                                src={showConfirmPassword ? "/images/visibility_icon.svg" : "/images/invisible_icon.svg"}
                                className="password-icon-img"
                                alt="password-icon"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            />
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className="error-msg">{formik.errors.confirmPassword}</div>
                        )}

                        <button className="main-button my-6" type="submit">Ahorrar</button>
                    </form>
                    <Link href="/login" className="flex justify-center forgot-pwd-link">
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyForgotCode;
