<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Auth::user()->notifications()
            ->orderBy('created_at', 'desc')
            ->get(); // Get all for now to easily categorize in frontend

        return response()->json($notifications);
    }

    public function unreadCount()
    {
        $query = Auth::user()->notifications();

        if (Schema::hasColumn('notifications', 'is_read')) {
            $query->where('is_read', false);
        } else {
            $query->whereNull('read_at');
        }

        return response()->json(['count' => $query->count()]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
            'unread_count' => Auth::user()->notifications()->whereNull('read_at')->count()
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        $query = $user->notifications();

        if (Schema::hasColumn('notifications', 'is_read')) {
            $query->where('is_read', false)->update(['is_read' => true]);
        } else {
            $query->whereNull('read_at')->update(['read_at' => now()]);
        }

        return response()->json([
            'message' => 'All notifications marked as read',
            'unread_count' => 0
        ]);
    }

    public function destroy($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}
