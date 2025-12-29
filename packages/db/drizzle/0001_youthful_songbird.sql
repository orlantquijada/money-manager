ALTER TABLE "funds" ALTER COLUMN "fund_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "fund_type" SET DEFAULT 'SPENDING'::text;--> statement-breakpoint
DROP TYPE "public"."FundType";--> statement-breakpoint
CREATE TYPE "public"."FundType" AS ENUM('SPENDING', 'NON_NEGOTIABLE');--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "fund_type" SET DEFAULT 'SPENDING'::"public"."FundType";--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "fund_type" SET DATA TYPE "public"."FundType" USING "fund_type"::"public"."FundType";--> statement-breakpoint
ALTER TABLE "funds" ADD COLUMN "due_day" integer;--> statement-breakpoint
CREATE INDEX "idx_transactions_fund_date" ON "transactions" USING btree ("fund_id","date");