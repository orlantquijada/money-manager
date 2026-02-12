-- folders
ALTER TABLE "folders" ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'Asia/Singapore';--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'Asia/Singapore';--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint

-- funds
ALTER TABLE "funds" ALTER COLUMN "paid_at" TYPE timestamptz USING "paid_at" AT TIME ZONE 'Asia/Singapore';--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "created_at" TYPE timestamptz USING "created_at" AT TIME ZONE 'Asia/Singapore';--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "updated_at" TYPE timestamptz USING "updated_at" AT TIME ZONE 'Asia/Singapore';--> statement-breakpoint
ALTER TABLE "funds" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint

-- transactions
ALTER TABLE "transactions" ALTER COLUMN "date" TYPE timestamptz USING "date" AT TIME ZONE 'Asia/Singapore';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "date" SET DEFAULT now();
