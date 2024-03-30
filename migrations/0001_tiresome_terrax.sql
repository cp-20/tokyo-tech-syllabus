DROP INDEX IF EXISTS `place_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `year_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `language_idx`;--> statement-breakpoint
CREATE INDEX `lecture_id_in_period_idx` ON `lecture_periods` (`lecture_id`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `lectures` (`title`);--> statement-breakpoint
CREATE INDEX `code_grade_idx` ON `lectures` (`code_grade`,`code_value`);--> statement-breakpoint
CREATE INDEX `lecture_id_in_assignment_idx` ON `teacher_assignment` (`lecture_id`);--> statement-breakpoint
CREATE INDEX `teacher_id_idx` ON `teacher_assignment` (`teacher_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `teachers` (`name`);