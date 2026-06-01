-- CreateTable
CREATE TABLE "return_orders" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "originalOrderId" INTEGER NOT NULL,
    "returnReason" TEXT,
    "items" JSONB NOT NULL,
    "itemsPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "shippingCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "trackingInfo" TEXT,
    "shippingAddress" JSONB,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "return_orders_documentId_key" ON "return_orders"("documentId");

-- AddForeignKey
ALTER TABLE "return_orders" ADD CONSTRAINT "return_orders_originalOrderId_fkey" FOREIGN KEY ("originalOrderId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
