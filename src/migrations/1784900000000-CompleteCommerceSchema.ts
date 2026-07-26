import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteCommerceSchema1784900000000 implements MigrationInterface {
  name = 'CompleteCommerceSchema1784900000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" character varying`);
    await queryRunner.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'userIdId') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'userId') THEN ALTER TABLE "products" RENAME COLUMN "userIdId" TO "userId"; END IF; END $$`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "addresses" ("id" SERIAL PRIMARY KEY, "userId" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "city" character varying NOT NULL, "landmark" character varying NOT NULL, "state" character varying NOT NULL, "pinCode" integer NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now())`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "cart_items" ("id" SERIAL PRIMARY KEY, "userId" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE, "productId" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE, "quantity" integer NOT NULL CHECK ("quantity" > 0), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cart_user_product" UNIQUE ("userId", "productId"))`);
    await queryRunner.query(`DO $$ BEGIN CREATE TYPE "promo_discount_type_enum" AS ENUM ('percentage', 'fixed_amount'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "promos" ("id" SERIAL PRIMARY KEY, "code" character varying NOT NULL UNIQUE, "discountType" "promo_discount_type_enum" NOT NULL, "discountValue" numeric(12,2) NOT NULL, "maxUses" integer NOT NULL, "usedTimes" integer NOT NULL DEFAULT 0, "expiresAt" TIMESTAMPTZ NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now())`);
    await queryRunner.query(`DO $$ BEGIN CREATE TYPE "order_status_enum" AS ENUM ('created', 'processing', 'shipped', 'in transit', 'out for delivery', 'delivered', 'cancelled', 'returned'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "orders" ("id" SERIAL PRIMARY KEY, "orderNumber" character varying NOT NULL, "buyerId" integer NOT NULL REFERENCES "users"("id"), "vendorId" integer NOT NULL REFERENCES "users"("id"), "productId" integer NOT NULL REFERENCES "products"("id"), "productTitle" character varying NOT NULL, "productPrice" numeric(12,2) NOT NULL, "productImages" text NOT NULL, "quantity" integer NOT NULL CHECK ("quantity" > 0), "discount" numeric(12,2) NOT NULL DEFAULT 0, "status" "order_status_enum" NOT NULL DEFAULT 'created', "paymentStatus" character varying NOT NULL DEFAULT 'paid', "placedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now())`);
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "reviews" ("id" SERIAL PRIMARY KEY, "orderId" integer NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE, "productId" integer NOT NULL REFERENCES "products"("id"), "userId" integer NOT NULL REFERENCES "users"("id"), "rating" integer NOT NULL CHECK ("rating" BETWEEN 1 AND 5), "comment" text NOT NULL, "media" text NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_review_order_user" UNIQUE ("orderId", "userId"))`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_addresses_user" ON "addresses" ("userId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_orders_buyer" ON "orders" ("buyerId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_orders_vendor" ON "orders" ("vendorId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_reviews_product" ON "reviews" ("productId")`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reviews"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "promos"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cart_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "addresses"`);
  }
}
