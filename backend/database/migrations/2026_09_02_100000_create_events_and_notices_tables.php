<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Events Table
        Schema::create('events', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('summary')->nullable();
            $table->date('event_date');
            $table->date('end_date')->nullable();
            $table->string('display_date')->nullable();
            $table->string('time_range')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->default('Conferences & Seminars');
            $table->enum('level', ['all', 'ug', 'pg'])->default('all');
            $table->string('ref_no')->nullable();
            $table->string('document_image')->nullable();
            $table->string('document_pdf')->nullable();
            $table->string('signatory')->nullable();
            $table->string('department')->nullable();
            $table->json('content')->nullable();
            $table->timestamps();
        });

        // 2. Sub-Events Table
        Schema::create('sub_events', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('event_id');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('event_date');
            $table->string('display_date')->nullable();
            $table->string('time_range')->nullable();
            $table->string('location')->nullable();
            $table->timestamps();
        });

        // 3. Attachments Table
        Schema::create('event_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->nullable();
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->string('sub_event_id')->nullable();
            $table->foreign('sub_event_id')->references('id')->on('sub_events')->onDelete('cascade');
            $table->string('title');
            $table->string('url');
            $table->string('type')->default('image/jpeg');
            $table->timestamps();
        });

        // 4. Notices Table (Both Standalone & Event-Linked)
        Schema::create('notices', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->nullable();
            $table->string('type')->default('Notice'); // Notice, Announcement, Event, Circular
            $table->enum('level', ['all', 'ug', 'pg'])->default('all');
            $table->string('title');
            $table->string('ref_no')->nullable();
            $table->date('date');
            $table->string('display_date')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->text('summary')->nullable();
            $table->string('document_image')->nullable();
            $table->json('content')->nullable();
            $table->string('signatory')->nullable();
            $table->string('department')->nullable();
            $table->string('link')->nullable();
            $table->boolean('downloadable')->default(false);
            $table->string('linked_event_id')->nullable();
            $table->foreign('linked_event_id')->references('id')->on('events')->onDelete('cascade');
            $table->string('linked_sub_event_id')->nullable();
            $table->foreign('linked_sub_event_id')->references('id')->on('sub_events')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
        Schema::dropIfExists('event_attachments');
        Schema::dropIfExists('sub_events');
        Schema::dropIfExists('events');
    }
};
