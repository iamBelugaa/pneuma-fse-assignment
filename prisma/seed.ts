import { PrismaClient } from '@/generated/prisma';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const creditCardsData = [
  { name: 'Air India Signature', bankName: 'SBI' },
  { name: 'Rewards', bankName: 'AXIS' },
  { name: 'Centurion', bankName: 'AMEX' },
  { name: 'Indulge', bankName: 'IndusInd' },
  { name: 'First Preferred Credit Card', bankName: 'YES' },
  { name: 'ThankYou Preferred', bankName: 'Citibank' },
  { name: 'Pride Platinum', bankName: 'AXIS' },
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

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('👤 Creating demo users...');
    await createDemoUsers();

    console.log('💳 Creating credit cards...');
    await createCreditCards();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createDemoUsers() {
  const hashedPassword = await hashPassword('DemoPassword@123');
  const users = [
    { email: 'demo@pneuma.club', password: hashedPassword },
    { email: 'admin@pneuma.club', password: hashedPassword },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User ${userData.email} already exists, skipping...`);
      createdUsers.push(existingUser);
      continue;
    }

    const user = await prisma.user.create({
      data: userData,
    });

    console.log(`Created user: ${user.email}`);
    createdUsers.push(user);
  }

  return createdUsers;
}

async function createCreditCards() {
  const createdCards = [];

  for (const cardData of creditCardsData) {
    const existingCard = await prisma.creditCard.findFirst({
      where: {
        name: cardData.name,
        bankName: cardData.bankName,
      },
    });

    if (existingCard) {
      console.log(
        `Credit card ${cardData.name} (${cardData.bankName}) already exists, skipping...`
      );
      createdCards.push(existingCard);
      continue;
    }

    const card = await prisma.creditCard.create({
      data: {
        name: cardData.name,
        bankName: cardData.bankName,
        archived: false,
      },
    });

    console.log(`Created credit card: ${card.name} (${card.bankName})`);
    createdCards.push(card);
  }

  return createdCards;
}

await main();
