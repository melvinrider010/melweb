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
        // 1. Add department_id and status to faculty table
        Schema::table('faculty', function (Blueprint $table) {
            $table->string('department_id')->nullable()->after('designation');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('department_id');
            
            $table->index(['status', 'department_id']);
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
        });

        // 2. Create faculty_programme pivot table
        Schema::create('faculty_programme', function (Blueprint $table) {
            $table->string('faculty_id');
            $table->string('programme_code');
            $table->timestamps();

            $table->primary(['faculty_id', 'programme_code']);
            $table->foreign('faculty_id')->references('id')->on('faculty')->cascadeOnDelete();
            $table->foreign('programme_code')->references('code')->on('programmes')->cascadeOnDelete();
            $table->index('programme_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_programme');

        Schema::table('faculty', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropIndex(['status', 'department_id']);
            $table->dropColumn(['department_id', 'status']);
        });
    }
};
