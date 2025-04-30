"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useLazyLoginQuery } from "../../../../services/auth/auth";
import { setLogin } from "../../../../redux/reducers/slice/authSlice";

const Carousel = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [login] = useLazyLoginQuery();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Correo inválido").required("El correo electrónico es obligatorio"),
            password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña es requerida"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await login({
                    email: values.email,
                    password: values.password,
                }).unwrap();
                toast.success(response.message);
                dispatch(setLogin(response?.data))
                router.push("/profile");
            } catch (err) {
                toast.error(err?.data?.message || "Error al iniciar sesión");
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

                <form className="login-form" onSubmit={formik.handleSubmit}>
                    <h6 className="form-field-title">Correo electrónico</h6>
                    <input
                        type="email"
                        name="email"
                        placeholder="myemail@gmail.com"
                        className="my-2.5 common-input"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="error-msg">{formik.errors.email}</p>
                    )}
                    <h6 className="form-field-title">Contraseña</h6>
                    <div className="password-main-div">
                        <input
                            type="password"
                            name="password"
                            placeholder="Escribe tu contraseña"
                            className="relative common-input"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                        <img src="/images/invisible_icon.svg" className="password-icon-img" alt="password-icon" />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                        <p className="error-msg">{formik.errors.password}</p>
                    )}
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            value="remember"
                            className="checkbox-input"
                        />
                        <label htmlFor="remember" className="">
                            Recuérdame
                        </label>
                    </div>
                    <button type="submit" className="main-button">
                        Iniciar sesión
                    </button>
                </form>
                <Link href="/forgot-password" className="forgot-pwd-link text-center">¿Olvidaste tu contraseña?</Link>
                <p className="login-text">¿No tienes una cuenta? <Link href="/signup" className="login-signup-link">Crear una ahora</Link></p>
            </div>
        </div>
    );
};

export default Carousel;
