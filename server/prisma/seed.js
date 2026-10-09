import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bg = {
  "A+": "A_POS", "A-": "A_NEG", "B+": "B_POS", "B-": "B_NEG",
  "AB+": "AB_POS", "AB-": "AB_NEG", "O+": "O_POS", "O-": "O_NEG"
};

async function main() {
  await prisma.match.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.donor.deleteMany();

  const donors = await Promise.all([
    prisma.donor.create({
      data: { token: "BD1001", fullName: "Asha Patil", phone: "9876500001", bloodGroup: bg["O+"], location: "Nashik Road" }
    }),
    prisma.donor.create({
      data: { token: "BD1002", fullName: "Rahul Sharma", phone: "9876500002", bloodGroup: bg["B+"], location: "Nashik" }
    }),
    prisma.donor.create({
      data: { token: "BD1003", fullName: "Rohan More", phone: "9876500003", bloodGroup: bg["A+"], location: "Panchavati" }
    })
  ]);

  const request = await prisma.bloodRequest.create({
    data: {
      token: "BR1001",
      patientName: "Demo Civil Hospital",
      contactPhone: "9876500010",
      bloodGroup: bg["O+"],
      location: "Nashik Road",
      unitsNeeded: 1
    }
  });

  await prisma.match.create({
    data: {
      donorId: donors[0].id,
      requestId: request.id,
      matchType: "EXACT + LOCATION",
      status: "PENDING"
    }
  });

  await prisma.activity.createMany({
    data: [
      {
        type: "DONOR_REGISTERED",
        donorId: donors[0].id,
        message: "SMS to BD1001: Registered as O+ donor in Nashik Road."
      },
      {
        type: "DONOR_REGISTERED",
        donorId: donors[1].id,
        message: "SMS to BD1002: Registered as B+ donor in Nashik."
      },
      {
        type: "REQUEST_CREATED",
        requestId: request.id,
        message: "Blood request BR1001 created for O+ in Nashik Road."
      }
    ]
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
