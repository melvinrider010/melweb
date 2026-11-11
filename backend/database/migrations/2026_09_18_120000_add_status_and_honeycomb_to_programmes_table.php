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
        Schema::table('programmes', function (Blueprint $table) {
            if (!Schema::hasColumn('programmes', 'status')) {
                $table->string('status')->default('published')->after('level');
            }
            if (!Schema::hasColumn('programmes', 'is_featured_honeycomb')) {
                $table->boolean('is_featured_honeycomb')->default(true)->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programmes', function (Blueprint $table) {
            if (Schema::hasColumn('programmes', 'is_featured_honeycomb')) {
                $table->dropColumn('is_featured_honeycomb');
            }
            if (Schema::hasColumn('programmes', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
