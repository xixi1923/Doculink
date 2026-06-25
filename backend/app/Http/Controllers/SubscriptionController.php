<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    // User: Submit Payment
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_type' => 'required|in:monthly,yearly',
            'amount' => 'required|numeric',
            'screenshot' => 'required|image|max:5120',
        ]);

        $subscription = new Subscription();
        $subscription->user_id = Auth::id();
        $subscription->plan_type = $request->plan_type;
        $subscription->amount = $request->amount;

        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('subscriptions', 'public');
            $subscription->screenshot_url = Storage::url($path);
        }

        $subscription->status = 'pending';
        $subscription->save();

        return response()->json([
            'message' => 'Payment submitted successfully. Please wait for admin approval.',
            'subscription' => $subscription
        ]);
    }

    // Admin: List Requests
    public function adminIndex()
    {
        return Subscription::with('user')->orderBy('created_at', 'desc')->paginate(20);
    }

    // Admin: Approve/Reject
    public function adminVerify(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string',
        ]);

        $subscription = Subscription::findOrFail($id);
        $subscription->status = $request->status;
        $subscription->admin_note = $request->admin_note;

        if ($request->status === 'approved') {
            $user = $subscription->user;
            $user->is_premium = true;

            $months = $subscription->plan_type === 'yearly' ? 12 : 1;
            $user->premium_until = Carbon::now()->addMonths($months);
            $user->save();

            $subscription->expires_at = $user->premium_until;
        }

        $subscription->save();

        return response()->json([
            'message' => 'Subscription updated successfully',
            'subscription' => $subscription
        ]);
    }

    public function userStatus()
    {
        $user = Auth::user();
        $latest = Subscription::where('user_id', $user->id)->orderBy('created_at', 'desc')->first();

        return response()->json([
            'is_premium' => $user->is_premium && ($user->premium_until > Carbon::now()),
            'premium_until' => $user->premium_until,
            'latest_request' => $latest
        ]);
    }
}
