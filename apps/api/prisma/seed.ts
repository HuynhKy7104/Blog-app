import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { fakerVI as faker } from '@faker-js/faker';
import { hash } from 'argon2';
import process from 'process';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// --- CÁC HẰNG SỐ CẤU HÌNH ---
const TOTAL_USERS = 20;
const MIN_POSTS_PER_USER = 15;
const MAX_POSTS_PER_USER = 20;
const MAX_COMMENTS_PER_POST = 15;
const MAX_LIKES_PER_POST = 15;
const PUBLISHED_RATIO = 0.8; // 80% post published, 20% draft
const BATCH_SIZE = 20;

// --- CÁC HÀM TIỆN ÍCH ---
function generateSlug(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// Hàm sinh ngày tạo và ngày cập nhật hợp lý trong vòng 2 năm qua
function generateTimestamps() {
  const createdAt = faker.date.past({ years: 2 });
  const updatedAt = faker.datatype.boolean()
    ? faker.date.between({ from: createdAt, to: new Date() })
    : createdAt;
  return { createdAt, updatedAt };
}

// --- HÀM CHÍNH ---
async function main() {
  console.time('Seed time');

  // 1. Dọn dữ liệu cũ
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.$executeRawUnsafe(`DELETE FROM "_PostToTag"`);
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await hash('123456');

  // 2. Seed user — 1 admin + còn lại user thường
  await prisma.user.createMany({
    data: Array.from({ length: TOTAL_USERS }).map((_, i) => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
      password: defaultPassword,
      role: i === 0 ? 'ADMIN' : 'USER',
      ...generateTimestamps(),
    })),
  });

  const allUserIds = (await prisma.user.findMany({ select: { id: true } })).map(
    (u) => u.id,
  );

  // 3. Seed tag
  const tagNames = [
    'Công nghệ',
    'Du lịch',
    'Ẩm thực',
    'Thể thao',
    'Giải trí',
    'Giáo dục',
    'Sức khoẻ',
    'Kinh doanh',
  ];

  await prisma.tag.createMany({ data: tagNames.map((name) => ({ name })) });
  const allTags = await prisma.tag.findMany({ select: { id: true } });

  // 4. Seed post (Đảm bảo mỗi User có 15-20 bài)
  const postInputs: any[] = [];
  let postCounter = 0;

  for (const userId of allUserIds) {
    const numPosts = faker.number.int({
      min: MIN_POSTS_PER_USER,
      max: MAX_POSTS_PER_USER,
    });

    for (let i = 0; i < numPosts; i++) {
      const title = faker.lorem.sentence();
      postInputs.push({
        title,
        slug: `${generateSlug(title)}-${postCounter++}`,
        content: faker.lorem.paragraphs(3),
        thumbnail: faker.image.url(),
        authorId: userId,
        published: faker.datatype.boolean({ probability: PUBLISHED_RATIO }),
        views: faker.number.int({ min: 10, max: 5000 }),
        ...generateTimestamps(),
      });
    }
  }

  await prisma.post.createMany({ data: postInputs });

  const allPosts = await prisma.post.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  // 5. Connect tag + comment + like theo batch
  const postBatches = chunk(allPosts, BATCH_SIZE);

  for (const [index, batch] of postBatches.entries()) {
    await prisma.$transaction(
      batch.map(({ id: postId }) => {
        const randomTags = faker.helpers.arrayElements(allTags, {
          min: 1,
          max: 3,
        });

        const commentCount = faker.number.int({
          min: 0,
          max: MAX_COMMENTS_PER_POST,
        });

        const likeUserIds = faker.helpers.arrayElements(allUserIds, {
          min: 0,
          max: Math.min(MAX_LIKES_PER_POST, allUserIds.length),
        });

        return prisma.post.update({
          where: { id: postId },
          data: {
            tags: { connect: randomTags.map((tag) => ({ id: tag.id })) },
            comments: {
              createMany: {
                data: Array.from({ length: commentCount }).map(() => ({
                  content: faker.lorem.sentence(),
                  authorId: faker.helpers.arrayElement(allUserIds),
                  ...generateTimestamps(),
                })),
              },
            },
            likes: {
              createMany: {
                data: likeUserIds.map((userId) => ({
                  userId,
                  createdAt: faker.date.past({ years: 1 }),
                })),
              },
            },
          },
        });
      }),
    );

    console.log(
      `Đã xử lý batch ${index + 1}/${postBatches.length} (${batch.length} post)`,
    );
  }

  console.log('Seeding Completed');
  console.timeEnd('Seed time');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
