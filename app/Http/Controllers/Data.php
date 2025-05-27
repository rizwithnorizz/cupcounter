<?php

namespace App\Http\Controllers;

use App\Events\RedeemNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Jobs\Store;
use App\Models\Redeem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
class Data extends Controller
{
    public function store(Request $request) : RedirectResponse { 
        try {
        $validate = $request->validate([
            'id' => 'required|integer|min:1400000',
            'name' => 'required|string',
            'year' => 'required|integer|between:1,4',
            'program' => 'required|string',
        ]);
        $existingRecord = Redeem::where('student_number', $validate['id'])->first();
        if ($existingRecord) {
            event(new RedeemNotification(0, 'You have already claimed your free coffee!'));
            return redirect()->back()->with('message', 'You have already claimed your free coffee!');
        }
        if (Redeem::where('created_at', '>=', now()->startOfDay())->count() >= 70){
            event(new RedeemNotification(0, 'Daily limit reached!'));
            return redirect()->back()->with('message', 'Daily limit reached!');
        }
        Store::dispatch($validate['name'], $validate['id'], $validate['year'], $validate['program']);
        return redirect()->back()->with('message', 'Coffee claimed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('message', 'Failed to claim coffee: ' . $e->getMessage());
        }
    }


    public function getCups(){
        $today = now()->startOfDay();
        $redeemed = Redeem::where('created_at', '>=', $today)->count();
        $dailyLimit = 70;
        $remaining = max(0, $dailyLimit - $redeemed);
        return response()->json([
            'redeemed_today' => $redeemed,
            'remaining' => $remaining,
        ]);
    }

    public function getRedeemers()
    {
        // Get today's date at the start of the day
        $today = now()->startOfDay();
        
        // Get all redeemers for today, ordered by most recent first
        $redeemers = Redeem::where('created_at', '>=', $today)
                          ->orderBy('created_at', 'desc')
                          ->get();
        
        return response()->json($redeemers);
    }
}

