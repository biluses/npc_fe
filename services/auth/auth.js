import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiVersion = process.env.NEXT_PUBLIC_VERSION;

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_HOST_API,
});

export const authApiSlice = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: `/public/${apiVersion}/user/auth/register`,
                method: "POST",
                body: credentials,
            }),
        }),
        login: builder.query({
            query: (credentials) => ({
                url: `/public/${apiVersion}/user/auth/login`,
                method: "POST",
                body: credentials,
            }),
        }),
        checkEmail: builder.query({
            query: (credentials) => ({
                url: `/public/${apiVersion}/user/auth/email-check`,
                method: "POST",
                body: credentials,
            }),
        }),
        verifyAccount: builder.query({
            query: (credentials) => ({
                url: `/public/${apiVersion}/user/auth/verify-account`,
                method: "POST",
                body: credentials,
            }),
        }),
        // forgotpassword: builder.query({
        //     query: (credentials) => ({
        //         url: `${apiVersion}/all-user/auth/send-forgot-mail`,
        //         method: "POST",
        //         body: credentials,
        //     }),
        // }),
        // verifyotp: builder.query({
        //     query: (credentials) => ({
        //         url: `${apiVersion}/all-user/auth/verify-otp`,
        //         method: "POST",
        //         body: credentials,
        //     }),
        // }),
        // sendotp: builder.mutation({
        //     query: (credentials) => ({
        //         url: `${apiVersion}/all-user/auth/send-otp`,
        //         method: "POST",
        //         body: credentials,
        //     }),
        // }),
    }),
});

export const { useLazyLoginQuery, useLazyCheckEmailQuery, useLazyVerifyAccountQuery, useLazyForgotpasswordQuery, useLazyVerifyotpQuery, useSendotpMutation, useRegisterMutation } = authApiSlice;
