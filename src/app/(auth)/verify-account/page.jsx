"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { setEmail, setLogin } from "../../../../redux/reducers/slice/authSlice";
import { useLazyVerifyAccountQuery } from "../../../../services/auth/auth";

const Carousel = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const secretId = typeof window !== 'undefined' ? localStorage.getItem('secretId') : null;
    const [verifyAccount] = useLazyVerifyAccountQuery();

    const otpLength = 6;
    const otpRefs = Array(otpLength).fill().map(() => useRef(null));

    const formik = useFormik({
        initialValues: {
            otp: "",
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .required("El OTP es obligatorio")
                .length(otpLength, `El OTP debe tener ${otpLength} dígitos`),
        }),
        onSubmit: async (values, { resetForm }) => {
            const payload = {
                verificationToken: values.otp,
                secretId: secretId
            };

            try {
                const response = await verifyAccount(payload).unwrap();
                console.log("response", response);
                if (response?.status) {
                    localStorage.removeItem("secretId");
                    toast.success(response?.message);
                    dispatch(setLogin(response?.data))
                    router.push("/profile");

                    router.push("/profile");
                } else {
                    toast.error("Algo salió mal");
                }
            } catch (err) {
                console.log("verifyAccount error:", err);
                toast.error(err?.data?.message || "Algo salió mal");
            } finally {
                resetForm();
                otpRefs[0].current?.focus();
            }
        },
    });

    // Auto-focus next input and set value
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const otpArray = formik.values.otp.split("");
        otpArray[index] = value;
        formik.setFieldValue("otp", otpArray.join(""));

        if (value && index < otpLength - 1) {
            otpRefs[index + 1].current?.focus();
        }
    };

    // Backspace handling
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !formik.values.otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    // Auto-submit if OTP fully entered
    useEffect(() => {
        if (formik.values.otp.length === otpLength) {
            formik.handleSubmit();
        }
    }, [formik.values.otp]);

    return (
        <div className="p-5">
            <div className="login-div">
                <img src="/images/logo_dark.png" alt="logo" />
                <h1 className="forgot-title">Verificar cuenta</h1>
                <div className="signup-form mt-6">
                    <form onSubmit={formik.handleSubmit}>
                        <p className="form-field-title">OTP</p>
                        <div className="otp-input-wrapper">
                            {[...Array(otpLength)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={otpRefs[index]}
                                    value={formik.values.otp[index] || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="otp-box"
                                />
                            ))}
                        </div>
                        {formik.errors.otp && formik.touched.otp && (
                            <p className="text-red-500 text-sm mt-2">{formik.errors.otp}</p>
                        )}
                        {/* <button
                            type="button"
                            className="text-primary-black text-lg font-medium flex ml-auto"
                            onClick={() => toast.info("OTP reenviado")}
                        >
                            Reenviar
                        </button> */}
                        <button className="main-button my-6" type="submit">Verificar</button>
                    </form>
                    <Link href="/login" className="flex justify-center forgot-pwd-link">
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
