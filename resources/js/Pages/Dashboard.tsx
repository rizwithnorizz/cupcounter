import CupCounter from '@/Components/CupCounter';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Dropdown from '@/Components/Dropdown';
import PrimaryButton from '@/Components/PrimaryButton';

interface Redeemer {
    id: number;
    student_number: string;
    name: string;
    year: number;
    program: string;
    created_at: string;
}

export default function Dashboard() {
    const [redeemers, setRedeemers] = useState<Redeemer[]>([]);
    const [filteredRedeemers, setFilteredRedeemers] = useState<Redeemer[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');
    const [confettiShown, setConfettiShown] = useState(false);

    const [filterDate, setFilterDate] = useState<string>('');
    const [filterProgram, setFilterProgram] = useState<string>('');
    const [filterYear, setFilterYear] = useState<string>('');

    const [uniquePrograms, setUniquePrograms] = useState<string[]>([]);
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);


    const fetchRedeemers = () => {
        axios.get('/api/redeemers')
            .then(response => {
                const data = response.data;
                setRedeemers(data);
                setFilteredRedeemers(data);
                setLoading(false);

                const programs = [...new Set(data.map((r: Redeemer) => r.program))] as string[];
                const years = [...new Set(data.map((r: Redeemer) => r.year))] as number[];
                setUniquePrograms(programs);
                setUniqueYears(years);
            })
            .catch(error => {
                console.error('Error fetching redeemers:', error);
                setLoading(false);
            });
    }
    useEffect(() => {
        fetchRedeemers();

        const updateTimer = () => {
            const now = new Date();

            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            setCurrentDate(now.toLocaleDateString('en-US', options));

            const targetTime = new Date(now);
            targetTime.setHours(13, 0, 0, 0);

            if (now > targetTime) {
                targetTime.setDate(targetTime.getDate() + 1);
            }

            const diff = targetTime.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            if (now.getHours() === 13 && now.getMinutes() === 0 && !confettiShown) {
                triggerConfetti();
                setConfettiShown(true);
            }
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, [confettiShown]);

    useEffect(() => {
        let result = [...redeemers];

        if (filterDate) {
            const selectedDate = new Date(filterDate);
            selectedDate.setHours(0, 0, 0, 0);

            result = result.filter(redeemer => {
                const redeemerDate = new Date(redeemer.created_at);
                redeemerDate.setHours(0, 0, 0, 0);
                return redeemerDate.getTime() === selectedDate.getTime();
            });
        }

        if (filterProgram) {
            result = result.filter(redeemer =>
                redeemer.program === filterProgram
            );
        }

        if (filterYear) {
            result = result.filter(redeemer =>
                redeemer.year === parseInt(filterYear)
            );
        }

        setFilteredRedeemers(result);
    }, [filterDate, filterProgram, filterYear, redeemers]);

    const [notification, setNotification] = useState<string>();

    useEffect(() => {
        if (window.Echo) {

            // Listen for the fully qualified event name
            window.Echo.channel('redeem').listen("RedeemNotification",
                (event: {
                    success: boolean;
                    message: string;
                }) => {
                    fetchRedeemers();
                }
            );

            return () => {
                window.Echo.leaveChannel("redeem");
            };
        }
    }, []);
    const resetFilters = () => {
        setFilterDate('');
        setFilterProgram('');
        setFilterYear('');
    };

    const tryConfetti = () => {
        triggerConfetti();
        setConfettiShown(true);
    };
    const triggerConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                colors: ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#FF00FF'],
                particleCount: Math.floor(particleCount)
            });
        }, 250);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Dashboard" />

            <header className="bg-white shadow flex justify-between">
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <div className="flex items-center p-4">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="flex justify-center md:w-40 bg-gray-100 inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    Admin

                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>

            </header>
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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Cup Counter Section */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg flex flex-col md:flex-row md:justify-between">

                        <div className="p-6">
                            <div className="flex flex-col items-center justify-center text-center">
                                <p className="text-md text-gray-600 mb-4">{currentDate}</p>
                                <div className="bg-blue-50 px-8 py-6 rounded-lg w-full max-w-md">
                                    <p className="text-lg text-gray-600 mb-2">Countdown to 1:00 PM</p>
                                    <p className="text-5xl font-bold text-blue-600 font-mono tracking-wider">{timeRemaining}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Coffee Redemption Status</h3>
                            <CupCounter className="mb-2" />
                        </div>
                    </div>
                    <PrimaryButton className="bg-gray-500 text-gray-900 mb-4" onClick={tryConfetti}>
                        Trigger Confetti
                    </PrimaryButton>
                    {/* Redeemer Details Section */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">Redeemer Details</h3>

                                {/* Filters */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div>
                                        <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date-filter"
                                            value={filterDate}
                                            onChange={(e) => setFilterDate(e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="program-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                            Program
                                        </label>
                                        <select
                                            id="program-filter"
                                            value={filterProgram}
                                            onChange={(e) => setFilterProgram(e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        >
                                            <option value="">All Programs</option>
                                            {uniquePrograms.map((program) => (
                                                <option key={program} value={program}>
                                                    {program}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                            Year
                                        </label>
                                        <select
                                            id="year-filter"
                                            value={filterYear}
                                            onChange={(e) => setFilterYear(e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        >
                                            <option value="">All Years</option>
                                            {uniqueYears.map((year) => (
                                                <option key={year} value={year.toString()}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <p className="text-gray-500">Loading redeemer data...</p>
                                </div>
                            ) : filteredRedeemers.length === 0 ? (
                                <div className="text-center py-4 border rounded-lg">
                                    <p className="text-gray-500">No redemptions match your filters.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Student Number
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Year
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Program
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {filteredRedeemers.map((redeemer) => (
                                                <tr key={redeemer.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {redeemer.student_number}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {redeemer.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {redeemer.year}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {redeemer.program}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {new Date(redeemer.created_at).toLocaleTimeString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}







