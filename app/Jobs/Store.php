<?php

namespace App\Jobs;

use App\Events\RedeemNotification;
use App\Models\Redeem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class Store implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $name,
        public int $student_number,
        public int $year,
        public string $program,
    ){}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try{
            $redeem = Redeem::create([
                'student_number' => $this->student_number,
                'name' => $this->name,
                'year' => $this->year,
                'program' => $this->program,
            ]);
            event(new RedeemNotification(1, 'Cup claimed!'));
        }catch(\Exception $e){
            event(new RedeemNotification(0, 'Redemption failed!'));
            throw $e;
        }
    }
}
