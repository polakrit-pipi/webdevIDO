-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payment_status" TEXT DEFAULT 'unpaid',
ADD COLUMN     "slip_transferred_at" TIMESTAMP(3),
ADD COLUMN     "slip_url" TEXT;
