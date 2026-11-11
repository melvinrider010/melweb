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
        // 1. Organograms Main Entity
        Schema::create('organograms', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default("St. Philomena's College Administrative Organogram");
            $table->text('description')->nullable();
            $table->string('status')->default('published'); // 'published', 'draft'
            $table->json('layout_settings')->nullable(); // direction, connectorStyle, spacing, theme
            $table->unsignedBigInteger('current_published_version_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });

        // 2. Organogram Versions Entity (Draft, Published, Archived)
        Schema::create('organogram_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organogram_id')->constrained('organograms')->onDelete('cascade');
            $table->string('version_number')->default('1.0');
            $table->string('status')->default('draft'); // 'draft', 'published', 'archived'
            $table->longText('snapshot_data')->nullable(); // JSON snapshot of full tree & layout
            $table->text('change_summary')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('published_by')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['organogram_id', 'status']);
        });

        // Add foreign key constraint to organograms for current_published_version_id
        Schema::table('organograms', function (Blueprint $table) {
            $table->foreign('current_published_version_id')
                  ->references('id')
                  ->on('organogram_versions')
                  ->nullOnDelete();
        });

        // 3. Organogram Nodes Entity
        Schema::create('organogram_nodes', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. "node_mdes", "node_rector", or UUID
            $table->foreignId('organogram_version_id')->constrained('organogram_versions')->onDelete('cascade');
            $table->string('parent_id')->nullable()->index();
            $table->string('node_type')->default('administration'); // governance, management, academic, administration, exam, committee, hostel
            $table->string('title');
            $table->string('designation')->nullable();
            $table->string('person_name')->nullable();
            $table->text('description')->nullable();
            $table->string('department_id')->nullable();
            $table->integer('display_order')->default(0);
            $table->json('node_metadata')->nullable(); // shape, bg_color, text_color, border_color, is_collapsed, page_link
            $table->timestamps();

            $table->index(['organogram_version_id', 'parent_id']);
            $table->index(['organogram_version_id', 'display_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organograms', function (Blueprint $table) {
            $table->dropForeign(['current_published_version_id']);
        });

        Schema::dropIfExists('organogram_nodes');
        Schema::dropIfExists('organogram_versions');
        Schema::dropIfExists('organograms');
    }
};
