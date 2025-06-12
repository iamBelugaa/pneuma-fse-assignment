import { PrismaClient } from '@/generated/prisma';
import { hashPassword } from '@/lib/auth';
import { CreateProgramInput } from '@/lib/schemas';

const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const creditCardsData: { name: string; bankName: string }[] = [
  { name: 'Air India Signature', bankName: 'SBI' },
  { name: 'Rewards', bankName: 'AXIS' },
  { name: 'Centurion', bankName: 'AMEX' },
  { name: 'Indulge', bankName: 'IndusInd' },
  { name: 'First Preferred credit card', bankName: 'YES' },
  { name: 'ThankYou Preferred', bankName: 'Citibank' },
  { name: 'Pride platinum', bankName: 'AXIS' },
  { name: 'Platinum Plus Credit Card', bankName: 'HDFC' },
  { name: 'Ink Business Cash', bankName: 'Chase' },
  { name: 'The Platinum Card', bankName: 'AMEX' },
  { name: 'Membership Rewards', bankName: 'AMEX' },
  { name: 'Etihad Guest Premier', bankName: 'SBI' },
  { name: 'Ink Plus', bankName: 'Chase' },
  { name: 'Propel American Express', bankName: 'Wells Fargo' },
  { name: 'Diners Club Rewardz Credit Card', bankName: 'HDFC' },
  { name: 'PRIVATE Credit Card', bankName: 'YES' },
  { name: 'Air India Platinum', bankName: 'SBI' },
  { name: 'Venture X Rewards', bankName: 'Capital One' },
  { name: 'Iconia', bankName: 'IndusInd' },
  { name: 'Business Gold', bankName: 'AMEX' },
];

const frequentFlyerProgramsData: CreateProgramInput[] = [
  {
    name: 'Royal Orchid Plus',
    assetName: '',
    enabled: true,
    transferRatios: [],
  },
  { name: 'KrisFlyer', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Asiana Club', assetName: '', enabled: true, transferRatios: [] },
  { name: 'AAdvantage', assetName: '', enabled: false, transferRatios: [] },
  { name: 'Flying Blue', assetName: '', enabled: true, transferRatios: [] },
  { name: 'SkyMiles', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Enrich', assetName: '', enabled: false, transferRatios: [] },
  { name: 'Privilege Club', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Miles&Smiles', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Skywards', assetName: '', enabled: false, transferRatios: [] },
  { name: 'Asia Miles', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Airpoints', assetName: '', enabled: false, transferRatios: [] },
  { name: 'Maharaja Club', assetName: '', enabled: true, transferRatios: [] },
  { name: 'TrueBlue', assetName: '', enabled: false, transferRatios: [] },
  { name: 'LifeMiles', assetName: '', enabled: false, transferRatios: [] },
  { name: 'Aeroplan', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Executive Club', assetName: '', enabled: true, transferRatios: [] },
  { name: 'Frequent Flyer', assetName: '', enabled: true, transferRatios: [] },
  { name: 'TAP Miles&Go', assetName: '', enabled: true, transferRatios: [] },
  {
    name: 'AeroMexico Rewards',
    assetName: '',
    enabled: true,
    transferRatios: [],
  },
];

async function main() {
  try {
    console.log('Starting database seeding...');

    console.log('Creating demo users...');
    const adminUserId = await createDemoUsers();

    console.log('Creating credit cards...');
    await createCreditCards();

    console.log('Creating frequent flyer programs...');
    await createFrequentFlyerPrograms(adminUserId);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createDemoUsers() {
  const createdUsers = [];
  const hashedPassword = await hashPassword('DemoPassword@123');
  const users = [
    { email: 'demo@pneuma.club', password: hashedPassword },
    { email: 'admin@pneuma.club', password: hashedPassword },
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User ${userData.email} already exists, skipping...`);
      createdUsers.push(existingUser);
      continue;
    }

    const user = await prisma.user.create({ data: userData });
    console.log(`Created user: ${user.email}`);
    createdUsers.push(user);
  }

  return createdUsers[createdUsers.length - 1].id;
}

async function createCreditCards() {
  const createdCards = [];

  for (const cardData of creditCardsData) {
    const existingCard = await prisma.creditCard.findFirst({
      where: { name: cardData.name, bankName: cardData.bankName },
    });

    if (existingCard) {
      console.log(
        `Credit card ${cardData.name} (${cardData.bankName}) already exists, skipping...`
      );
      createdCards.push(existingCard);
      continue;
    }

    const card = await prisma.creditCard.create({
      data: { name: cardData.name, bankName: cardData.bankName },
    });

    console.log(
      `Created credit card: ${card.name} (${card.bankName}) - ${
        card.archived ? 'Archived' : 'Active'
      }`
    );

    createdCards.push(card);
  }

  return createdCards;
}

async function createFrequentFlyerPrograms(adminUserId: string) {
  const createdPrograms = [];

  for (const programData of frequentFlyerProgramsData) {
    const existingProgram = await prisma.frequentFlyerProgram.findFirst({
      where: { name: programData.name, createdById: adminUserId },
    });

    if (existingProgram) {
      console.log(
        `Frequent flyer program "${programData.name}" already exists for admin user, skipping...`
      );
      createdPrograms.push(existingProgram);
      continue;
    }

    const program = await prisma.frequentFlyerProgram.create({
      data: {
        name: programData.name,
        archived: false,
        enabled: programData.enabled,
        assetName: programData.assetName,
        createdById: adminUserId,
        modifiedById: adminUserId,
      },
      select: {
        id: true,
        name: true,
        assetName: true,
        enabled: true,
        archived: true,
        createdAt: true,
        modifiedAt: true,
        createdBy: { select: { id: true, email: true } },
        modifiedBy: { select: { id: true, email: true } },
        transferRatios: {
          where: { archived: false },
          select: {
            id: true,
            ratio: true,
            creditCard: {
              select: {
                id: true,
                name: true,
                bankName: true,
              },
            },
          },
        },
      },
    });

    console.log(`Created frequent flyer program: ${program.name}`);
    createdPrograms.push(program);
  }

  console.log(
    `✅ Created ${createdPrograms.length} frequent flyer programs for admin user`
  );
  return createdPrograms;
}

await main();
