<?php

namespace App\Events;


use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RedeemNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public bool $success, public string $message)
    {
        
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('redeem'),
        ];
    }

    /**
     * The data to broadcast
     * 
     * @return array<string, mixed>
     */
    public function broadcastWith() : array
    {
        if ($this->success) {
        return  [
            'success' => true,
            'message' => $this->message
        ];
        } else {
            return  [
                'success' => false,
                'message' => $this->message
            ];
        }
    }
}
