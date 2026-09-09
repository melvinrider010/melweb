<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Event;
use App\Models\SubEvent;
use App\Models\Notice;
use App\Models\Faculty;
use App\Models\Document;
use App\Models\Slider;
use App\Models\Setting;
use App\Models\ActivityLog;
use App\Policies\UserPolicy;
use App\Policies\EventPolicy;
use App\Policies\NoticePolicy;
use App\Policies\FacultyPolicy;
use App\Policies\DocumentPolicy;
use App\Policies\SliderPolicy;
use App\Policies\SettingPolicy;
use App\Policies\ActivityLogPolicy;
use App\Observers\EventObserver;
use App\Observers\SubEventObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Notice::class, NoticePolicy::class);
        Gate::policy(Faculty::class, FacultyPolicy::class);
        Gate::policy(Document::class, DocumentPolicy::class);
        Gate::policy(Slider::class, SliderPolicy::class);
        Gate::policy(Setting::class, SettingPolicy::class);
        Gate::policy(ActivityLog::class, ActivityLogPolicy::class);

        Event::observe(EventObserver::class);
        SubEvent::observe(SubEventObserver::class);
    }
}