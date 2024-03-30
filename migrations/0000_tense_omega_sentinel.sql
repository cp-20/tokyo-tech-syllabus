CREATE TABLE `lecture_periods` (
	`lecture_id` integer NOT NULL,
	`classroom` text,
	`period` text NOT NULL,
	PRIMARY KEY(`lecture_id`, `period`),
	FOREIGN KEY (`lecture_id`) REFERENCES `lectures`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lectures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`origin` text NOT NULL,
	`place_type` text NOT NULL,
	`place_value` text,
	`code_grade` text NOT NULL,
	`code_value` text NOT NULL,
	`credit` integer NOT NULL,
	`year` text NOT NULL,
	`quarter` text NOT NULL,
	`language` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teacher_assignment` (
	`lecture_id` integer NOT NULL,
	`teacher_id` integer NOT NULL,
	PRIMARY KEY(`lecture_id`, `teacher_id`),
	FOREIGN KEY (`lecture_id`) REFERENCES `lectures`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `lecture_id_in_period_idx` ON `lecture_periods` (`lecture_id`);--> statement-breakpoint
CREATE INDEX `period_idx` ON `lecture_periods` (`period`);--> statement-breakpoint
CREATE UNIQUE INDEX `lectures_url_unique` ON `lectures` (`url`);--> statement-breakpoint
CREATE INDEX `code_grade_idx` ON `lectures` (`code_grade`,`code_value`);--> statement-breakpoint
CREATE INDEX `lecture_id_in_assignment_idx` ON `teacher_assignment` (`lecture_id`);--> statement-breakpoint
CREATE INDEX `teacher_id_idx` ON `teacher_assignment` (`teacher_id`);