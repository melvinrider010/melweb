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
        // 1. Sliders Table
        Schema::create('sliders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('category')->nullable();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('image');
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
            $table->string('status')->default('published');
            $table->integer('priority')->default(1);
            $table->timestamps();
        });

        // 2. Media Table
        Schema::create('media', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->text('original_url')->nullable();
            $table->text('local_path')->nullable();
            $table->string('filename');
            $table->string('category')->default('campus');
            $table->text('alt_text')->nullable();
            $table->bigInteger('file_size')->default(0);
            $table->string('sha256')->nullable();
            $table->string('download_status')->default('Downloaded');
            $table->string('discovered_at')->nullable();
            $table->timestamps();
        });

        // 3. Documents Table
        Schema::create('documents', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('filename');
            $table->text('original_url')->nullable();
            $table->text('local_path')->nullable();
            $table->string('category')->default('Other');
            $table->string('year')->nullable();
            $table->string('extension')->default('pdf');
            $table->bigInteger('file_size')->default(0);
            $table->string('sha256')->nullable();
            $table->string('download_status')->default('Downloaded');
            $table->timestamps();
        });

        // 4. Faculty Table
        Schema::create('faculty', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('designation')->nullable();
            $table->string('department')->nullable();
            $table->string('qualification')->nullable();
            $table->string('source_url')->nullable();
            $table->boolean('source_verified')->default(true);
            $table->text('profile')->nullable();
            $table->string('photo_url')->nullable();
            $table->timestamps();
        });

        // 5. Departments Table
        Schema::create('departments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('head')->nullable();
            $table->text('description')->nullable();
            $table->json('programmes')->nullable();
            $table->timestamps();
        });

        // 6. Programmes Table (Both UG & PG)
        Schema::create('programmes', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->enum('level', ['ug', 'pg'])->default('ug');
            $table->string('title');
            $table->string('degree')->nullable();
            $table->string('duration')->nullable();
            $table->text('eligibility')->nullable();
            $table->text('overview')->nullable();
            $table->json('departments')->nullable();
            $table->string('pdf_link')->nullable();
            $table->text('outcomes')->nullable();
            $table->string('source_url')->nullable();
            $table->boolean('source_verified')->default(true);
            $table->timestamps();
        });

        // 7. Activity Logs Table
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_email')->nullable();
            $table->string('action');
            $table->string('module');
            $table->text('details');
            $table->timestamps();
        });

        // 8. Settings Table
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('programmes');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('faculty');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('media');
        Schema::dropIfExists('sliders');
    }
};
