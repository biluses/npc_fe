"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Checkout() {
    const router = useRouter();
    const [isOpenConfirmModel, setIsOpenConfirmModel] = useState(false);
    return (
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 space-y-6 font-sans">
            <div class="space-y-2">
                <h2 class="text-sm font-semibold text-gray-800">Entregar a</h2>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <p class="font-semibold text-gray-900">Sarah Stewart</p>
                    <p class="text-sm text-gray-600">123 Paseo de Calle, Madrid, 12345</p>
                    <button class="text-sm text-pink-500 font-medium mt-1 hover:underline">Editar dirección</button>
                </div>
            </div>
            <div class="space-y-4">
                <h2 class="text-sm font-semibold text-gray-800">Método de pago</h2>
                <label class="flex items-center gap-3 border border-gray-300 p-3 rounded-lg cursor-pointer hover:border-gray-400">
                    <input type="radio" name="payment" class="form-radio text-black" />
                    <img src="https://www.gstatic.com/pay/button/svg/black.svg" alt="Google Pay" class="h-6" />
                    <span class="text-sm text-gray-800">Google Pay</span>
                </label>
                <label class="flex items-center gap-3 border border-gray-300 p-3 rounded-lg cursor-pointer hover:border-gray-400">
                    <input type="radio" name="payment" class="form-radio text-black" />
                    <img src="https://developer.apple.com/design/human-interface-guidelines/apple-pay/images/apple-pay-logo_2x.png" alt="Apple Pay" class="h-6" />
                    <span class="text-sm text-gray-800">Apple Pay</span>
                </label>
                <label class="flex items-center gap-3 border border-gray-300 p-3 rounded-lg cursor-pointer hover:border-gray-400">
                    <input type="radio" name="payment" checked class="form-radio text-black" />
                    <svg class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18M3 14h6m6 0h6M3 18h18" />
                    </svg>
                    <span class="text-sm text-gray-800">Tarjeta de crédito</span>
                </label>
            </div>
            <div class="space-y-3">
                <label class="block">
                    <span class="text-sm text-gray-700">Titular</span>
                    <input
                        type="text"
                        placeholder="Titular de la tarjeta"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </label>
            </div>

            <div class="border-t pt-4 text-sm text-gray-700 space-y-1">
                <div class="flex justify-between">
                    <span>Envío</span>
                    <span>€10.00</span>
                </div>
                <div class="flex justify-between">
                    <span>Total de artículos (1)</span>
                    <span>€38.00</span>
                </div>
                <div class="flex justify-between font-bold text-lg text-black">
                    <span>Total</span>
                    <span>€48.00</span>
                </div>
            </div>
            <button class="w-full bg-yellow-300 text-black font-semibold py-3 rounded-full hover:bg-yellow-400 transition">
                Confirmar y pagar
            </button>
        </div>

    );
}