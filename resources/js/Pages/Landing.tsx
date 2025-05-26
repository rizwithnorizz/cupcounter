import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import CupCounter from "@/Components/CupCounter";

export default function Landing() {
    const [notification, setNotification] = useState<string>();
    const { data, setData, post, processing, errors, reset } = useForm({
        id: 0,
        name: "",
        year: 1,
        program: "",
    });
    useEffect(() => {
        if (window.Echo) {

            // Listen for the fully qualified event name
            window.Echo.channel('redeem').listen("RedeemNotification",
                (event: {
                    success: boolean;
                    message: string;
                }) => {
                    setNotification(
                        event.message
                    );
                    setTimeout(() => setNotification(''), 5000);
                }
            );

            return () => {
                window.Echo.leaveChannel("redeem");
            };
        }
    }, []);
    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {

            post(route('student.store'), {
                onSuccess: () => {
                    reset();
                },
                onError: (errors) => {
                    console.log(errors.message);
                }
            });
        } catch (error) {
            window.alert(error);
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {notification && (
                <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md transition-opacity duration-500">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}
            {/* Header with logos */}
            <div className="w-full bg-white shadow-sm py-4">
                <div className="container mx-auto flex items-center justify-center space-x-4">
                    <img src="/sg.png" className="h-12 w-12 md:h-16 md:w-16" alt="SG Logo" />
                    <img src="/ub.png" className="h-14 w-28 md:h-20 md:w-40" alt="UB Logo" />
                </div>
            </div>

            {/* Main content */}
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                    {/* Left side - Branding */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
                        <div className="mb-8 text-center md:text-left">
                            <img src="/iced.png" className="h-40 w-80 mx-auto md:mx-0 mb-6" alt="Iced Coffee" />
                            <p className="text-xl md:text-2xl font-medium text-blue-600 italic">
                                Inspire - Conquer - Excel
                            </p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-blue-100 w-full max-w-md mb-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Free Coffee!</h2>
                            <p className="text-gray-600 mb-4">Take a moment to recharge with a complimentary coffee. Fill out the form to claim your free cup!</p>
                            <div className="flex items-center text-amber-600 font-medium">
                                <span className="mr-2">⏰</span> Limited time offer for students
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                        <CupCounter className="mb-6" />
                            
                        </div>

                    </div>

                    {/* Right side - Form */}
                    <div className="w-full md:w-1/2 max-w-md">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="bg-blue-600 py-4 px-6">
                                <h3 className="text-2xl font-bold text-white text-center">CLAIM FREE COFFEE</h3>
                            </div>
                            <form onSubmit={submit} className="p-6">
                                <div className="mb-5">
                                    <InputLabel htmlFor="id" value="Student ID" className="text-gray-700" />
                                    <TextInput
                                        id="id"
                                        type="number"
                                        name="id"
                                        value={data.id ? data.id : ''}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        onChange={(e) =>
                                            setData("id", parseInt(e.target.value))
                                        }
                                        required
                                        min="1"
                                    />
                                    <InputError
                                        message={errors.id}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-5">
                                    <InputLabel htmlFor="name" value="Name" className="text-gray-700" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-5">
                                    <InputLabel htmlFor="year" value="Year Level" className="text-gray-700" />
                                    <TextInput
                                        id="year"
                                        type="number"
                                        name="year"
                                        value={data.year}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        onChange={(e) =>
                                            setData("year", parseInt(e.target.value))
                                        }
                                        required
                                        min="1"
                                    />
                                    <InputError
                                        message={errors.year}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-5">
                                    <InputLabel htmlFor="progrm" value="Program" className="text-gray-700" />
                                    <select
                                        id="program"
                                        name="program"
                                        value={data.program}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        onChange={(e) =>
                                            setData("program", e.target.value)
                                        }
                                        required>
                                        <option value="">Select your course</option>
                                        <option value="BSCS">BSCS</option>
                                        <option value="BSIT">BSIT</option>
                                        <option value="BSIS">BSIS</option>
                                        <option value="BLIS">BLIS</option>
                                        <option value="ACT">ACT</option>
                                    </select>
                                    <InputError
                                        message={errors.program}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Processing...' : 'Claim My Coffee'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
