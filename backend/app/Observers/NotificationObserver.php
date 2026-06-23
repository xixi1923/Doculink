<?php

namespace App\Observers;

use App\Models\Notification;
use App\Events\NotificationSent;

class NotificationObserver
{
    public function created(Notification $notification): void
    {
        broadcast(new NotificationSent($notification))->toOthers();
    }
}
