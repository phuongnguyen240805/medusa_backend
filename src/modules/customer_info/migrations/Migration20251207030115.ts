import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251207030115 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customer_info" ("id" text not null, "customer_id" text null, "full_name" text null, "card_id" text null, "origin" text null, "business_name" text null, "tax_code" text null, "account_type" text not null default 'personal', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_info_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_info_deleted_at" ON "customer_info" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_info" cascade;`);
  }

}
