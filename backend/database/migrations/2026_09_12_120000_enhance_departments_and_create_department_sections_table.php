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
        // 1. Enhance departments table with CMS capabilities
        Schema::table('departments', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->text('short_description')->nullable()->after('slug');
            $table->string('banner_image')->nullable()->after('description');
            $table->enum('status', ['draft', 'published', 'unpublished'])->default('published')->after('banner_image');
            $table->integer('display_order')->default(0)->after('status');
            $table->string('seo_title')->nullable()->after('display_order');
            $table->text('seo_description')->nullable()->after('seo_title');
            $table->timestamp('published_at')->nullable()->after('seo_description');
            $table->string('published_by')->nullable()->after('published_at');
            $table->string('last_updated_by')->nullable()->after('published_by');

            $table->index(['status', 'display_order']);
        });

        // 2. Create department_sections table for flexible section-based page architecture
        Schema::create('department_sections', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('department_id');
            $table->string('section_key'); // e.g., 'about', 'vision_mission', 'programs', 'faculty', 'facilities', 'achievements', 'documents', 'notices', 'events', 'gallery', 'contact'
            $table->string('title');
            $table->string('type'); // 'text', 'image', 'text_image', 'cards', 'links', 'documents', 'tables', 'gallery', 'programs', 'faculty', 'facilities', 'notices', 'events', 'contact'
            $table->json('content')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->enum('version', ['published', 'draft'])->default('published');
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->index(['department_id', 'version', 'display_order']);
            $table->index(['department_id', 'section_key', 'version']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_sections');

        Schema::table('departments', function (Blueprint $table) {
            $table->dropIndex(['status', 'display_order']);
            $table->dropColumn([
                'slug',
                'short_description',
                'banner_image',
                'status',
                'display_order',
                'seo_title',
                'seo_description',
                'published_at',
                'published_by',
                'last_updated_by'
            ]);
        });
    }
};
