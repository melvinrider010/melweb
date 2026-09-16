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
        Schema::create('department_faculty', function (Blueprint $table) {
            $table->string('department_id');
            $table->string('faculty_id');
            $table->timestamps();

            $table->primary(['department_id', 'faculty_id']);
            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
            $table->foreign('faculty_id')->references('id')->on('faculty')->cascadeOnDelete();
            $table->index('department_id');
            $table->index('faculty_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('department_faculty');
    }
};
