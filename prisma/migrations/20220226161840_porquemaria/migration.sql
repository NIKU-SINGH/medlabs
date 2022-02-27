-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Lab" (
    "labName" TEXT NOT NULL,
    "labId" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "labImage" TEXT,
    "phone" TEXT,
    "certificateNo" TEXT,
    "location" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("labId")
);

-- CreateTable
CREATE TABLE "UserTestBooked" (
    "userId" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "labId" INTEGER NOT NULL,
    "bookedAt" TEXT NOT NULL,
    "bookedFor" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUserId" TEXT,

    CONSTRAINT "UserTestBooked_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Test" (
    "testName" TEXT NOT NULL,
    "testId" SERIAL NOT NULL,
    "labTestId" INTEGER,
    "testPrice" INTEGER NOT NULL,
    "testDescription" TEXT NOT NULL,
    "testImage" TEXT,
    "homeCollection" BOOLEAN NOT NULL,
    "userTestBookedUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientDetailsPateintId" INTEGER,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("testId")
);

-- CreateTable
CREATE TABLE "PatientDetails" (
    "pateintId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "Height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "userTestBookedUserId" INTEGER,

    CONSTRAINT "PatientDetails_pkey" PRIMARY KEY ("pateintId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserTestBooked" ADD CONSTRAINT "UserTestBooked_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_labTestId_fkey" FOREIGN KEY ("labTestId") REFERENCES "Lab"("labId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_patientDetailsPateintId_fkey" FOREIGN KEY ("patientDetailsPateintId") REFERENCES "PatientDetails"("pateintId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDetails" ADD CONSTRAINT "PatientDetails_userTestBookedUserId_fkey" FOREIGN KEY ("userTestBookedUserId") REFERENCES "UserTestBooked"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
