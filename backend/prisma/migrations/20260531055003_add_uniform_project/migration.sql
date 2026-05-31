-- CreateTable
CREATE TABLE "uniform_projects" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientName" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Work Uniform',
    "description" TEXT,
    "images" JSONB,
    "coverImage" TEXT,
    "tags" TEXT[],
    "quantity" INTEGER,
    "material" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniform_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uniform_projects_documentId_key" ON "uniform_projects"("documentId");
