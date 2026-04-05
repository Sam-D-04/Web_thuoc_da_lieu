-- Migration: Add verification_code columns to users table
-- Run this SQL directly on your database if you can't run php artisan migrate

ALTER TABLE `users` 
ADD COLUMN `verification_code` VARCHAR(255) NULL AFTER `email_verified_at`,
ADD COLUMN `verification_code_expires_at` TIMESTAMP NULL AFTER `verification_code`;

