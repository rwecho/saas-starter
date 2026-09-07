ALTER TABLE "teams" ADD COLUMN "payment_provider" varchar(20);
ALTER TABLE "teams" ADD COLUMN "paypal_subscription_id" text;
ALTER TABLE "teams" ADD COLUMN "paypal_plan_id" text;
ALTER TABLE "teams" ADD CONSTRAINT "teams_paypal_subscription_id_unique" UNIQUE("paypal_subscription_id");
