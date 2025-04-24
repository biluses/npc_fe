"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../../../services/auth/auth";
import { setEmail, setLogin } from "../../../../redux/reducers/slice/authSlice";

const MultiStepForm = () => {
    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state?.persistedReducer.user.email);
    const [step, setStep] = useState(1);
    const [image, setImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [register] = useRegisterMutation();

    const router = useRouter();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const validationSchemas = [
        Yup.object({
            password: Yup.string().min(6, "Min 6 characters").required("Required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Required"),
        }),
        Yup.object({
            username: Yup.string().required("Name is required"),
            address1: Yup.string().required("Required"),
            address2: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            state: Yup.string().required("Required"),
            postalCode: Yup.string().required("Required"),
        }),
        Yup.object({}),
    ];

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
            username: "",
            address1: "",
            address2: "",
            postalCode: "",
            city: "",
            state: "",
        },
        validationSchema: validationSchemas[step - 1],
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (step < 3) {
                setStep((prev) => prev + 1);
            } else {
                console.log("Final Values", values);
                const { confirmPassword, ...filterPayload } = values;
                const payload = {
                    email: userEmail,
                    loginType: "email",
                    ...filterPayload,
                    ...(image != null && { profilePicture: image })
                }
                try {
                    const response = await register(payload).unwrap();
                    toast.success(response.message);
                    console.log("response", response);
                    dispatch(setEmail(null));
                    dispatch(setLogin(response?.data))
                    router.push("/profile");

                } catch (err) {
                    console.log("signup api error", err);
                    toast.error(err?.data?.message || 'Something went wrong');
                } finally {
                    setSubmitting(false);
                    resetForm();
                }
                router.push("/profile");
            }
        },
    });

    return (
        <div className="p-5">
            <div className="login-div">
                <img src="/images/logo_dark.png" alt="logo" className="w-[82pt] h-[27pt]" />
            </div>
            <div className="flex justify-center space-x-6 text-gray-400 font-bold pt-5">
                <div
                    className={`flex flex-col text-center transition-all duration-500 ${step === 1 ? "text-4xl text-black cursor-pointer scale-110" : step === 3 ? "text-base" : "cursor-pointer text-2xl"}`}
                    onClick={() => step > 1 && setStep(1)}
                >
                    <span>paso</span>
                    <span className={`${step === 1 ? "text-5xl" : step === 3 ? "text-xl" : "text-3xl"}`}>1</span>
                </div>
                <div
                    className={`flex flex-col text-center transition-all duration-500 ${step === 2 ? "text-4xl text-black cursor-pointer scale-110" : "cursor-pointer text-2xl"}`}
                    onClick={() => step >= 2 && setStep(2)}
                >
                    <span>paso</span>
                    <span className={`${step === 2 ? "text-5xl" : "text-3xl"}`}>2</span>
                </div>
                <div className={`flex flex-col text-center transition-all duration-500 ${step === 3 ? "text-4xl text-black cursor-pointer scale-110" : step === 1 ? "text-base" : "cursor-pointer text-2xl"}`}>
                    <span>paso</span>
                    <span className={`${step === 3 ? "text-5xl" : step === 1 ? "text-xl" : "text-3xl"}`}>3</span>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit}>
                {
                    step === 1 && (
                        <div className="login-form-bg transition-all duration-500 scale-100">
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
                                <img src={showPassword ? "/images/visibility_icon.svg" : "/images/invisible_icon.svg"} className="password-icon-img" alt="password-icon" onClick={() => setShowPassword((prev) => !prev)} />
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="error-msg">{formik.errors.password}</div>
                            )}
                            <p className="form-field-title">Repite contraseña</p>
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
                                <img src={showConfirmPassword ? "/images/visibility_icon.svg" : "/images/invisible_icon.svg"} className="password-icon-img" alt="password-icon" onClick={() => setShowConfirmPassword((prev) => !prev)} />
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="error-msg">{formik.errors.confirmPassword}</div>
                            )}
                        </div>
                    )
                }

                {
                    step === 2 && (
                        <div className="login-form-bg block space-y-2 transition-all duration-500 scale-100">
                            <p className="form-field-title">¿Cómo te llamamos?</p>
                            <input
                                type="text"
                                name="username"
                                placeholder="Tu nombre"
                                className="common-input"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className="error-msg my-1">{formik.errors.username}</div>
                            )}
                            <p className="form-field-title pt-8">Dirección para recibir tokens</p>
                            <input
                                type="text"
                                name="address1"
                                placeholder="Dirección 1"
                                className="common-input"
                                value={formik.values.address1}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.address1 && formik.errors.address1 && (
                                <div className="error-msg">{formik.errors.address1}</div>
                            )}
                            <input
                                type="text"
                                name="address2"
                                placeholder="Dirección 2"
                                className="common-input"
                                value={formik.values.address2}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="Provincia"
                                className="common-input"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="estado"
                                className="common-input"
                                value={formik.values.state}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Código postal"
                                className="common-input !w-1/2"
                                value={formik.values.postalCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    )
                }

                {
                    step === 3 && (
                        <div className="login-form-bg  transition-all duration-500 scale-100">
                            <div className="flex flex-col items-center">
                                <div className="profile-image-container">
                                    {image ? (
                                        <img src={image} alt="Profile" className="profile-img" />
                                    ) : (
                                        <span className="text-[68pt] leading-[83px] font-extrabold text-black">SA</span>
                                    )}
                                </div>
                                <div className="profile-div">
                                    {image ? (
                                        <>
                                            <label htmlFor="fileInput" className="add-profile-text">
                                                Cambiar foto
                                            </label>
                                            <img src="/images/delete-icon.svg" alt="delete-icon" className="delete-icon" />
                                        </>
                                    ) : (
                                        <label htmlFor="fileInput" className="add-profile-text">
                                            Añadir una foto
                                        </label>
                                    )}
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    )
                }
                <button type="submit" className="main-button mt-4">
                    {step === 3 ? "Hecho" : "Siguiente"}
                </button>
            </form>
        </div >
    );
};

export default MultiStepForm;
