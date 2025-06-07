-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "trained";
--> statement-breakpoint
CREATE TABLE "trained"."beatmaps" (
	"id" bigint PRIMARY KEY NOT NULL,
	"embedding" vector(768),
	"embedding_begin" vector(768),
	"embedding_middle" vector(768),
	"embedding_end" vector(768),
	"embedding_full" vector(768),
	"embedding_r2" vector(768),
	"beatmapset_id" bigint,
	"max_pp" real
);
--> statement-breakpoint
CREATE INDEX "beatmaps_beatmapset_id" ON "trained"."beatmaps" USING hash ("beatmapset_id" int8_ops);
*/