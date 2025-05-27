import { useEffect, useState } from 'react';
import axios from 'axios';
interface CupCounterProps {
    className?: string;
}
export default function CupCounter({ className = '' }: CupCounterProps) {
    const [cupData, setCupData] = useState({
        redeemed_today: 0, remaining: 0
    }); const [loading, setLoading] = useState(true);
    useEffect(() => {

        if (window.Echo) {
            window.Echo.channel('redeem').listen('RedeemNotification', (event: { message: string, success: boolean }) => {

                axios.get('/remaining-cups').then(response => {
                    setCupData(response.data); setLoading(false);
                }).catch(error => {
                    console.error('Error fetching cup data:', error); setLoading(false);
                });
            });
        }
    }, []);
    useEffect(() => {
        axios.get('/remaining-cups').then(response => {
            setCupData(response.data); setLoading(false);
        }).catch(error => {
            console.error('Error fetching cup data:', error); setLoading(false);
        });
    }, []);
    return (
        <div className={`flex gap-4 ${className}`}>
            <div className="flex rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                            <line x1="6" x2="6" y1="2" y2="4"></line>
                            <line x1="10" x2="10" y1="2" y2="4"></line>
                            <line x1="14" x2="14" y1="2" y2="4"></line>
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Remaining Cups</p>
                    <div className="h-12 flex items-center justify-center">
                        <p className="text-3xl font-bold text-gray-900">{loading ? '...' : cupData.remaining}</p>
                    </div>
                </div>
            </div>
            <div className="flex rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                            <line x1="6" y1="1" x2="6" y2="4"></line>
                            <line x1="10" y1="1" x2="10" y2="4"></line>
                            <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Claimed Today</p>
                    <div className="h-12 flex items-center justify-center">
                        <p className="text-3xl font-bold text-gray-900 ">{loading ? '...' : cupData.redeemed_today}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

