CREATE TABLE `lecture_names` (
	`lecture_id` integer NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`lecture_id`, `name`),
	FOREIGN KEY (`lecture_id`) REFERENCES `lectures`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teacher_names` (
	`teacher_id` integer NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`name`, `teacher_id`),
	FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP INDEX IF EXISTS `title_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `name_idx`;--> statement-breakpoint
CREATE INDEX `lecture_id_in_name_idx` ON `lecture_names` (`lecture_id`);--> statement-breakpoint
CREATE INDEX `teacher_id_in_name_idx` ON `teacher_names` (`teacher_id`);