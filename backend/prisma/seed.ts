import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'System Admin',
            password: hashedPassword,
            role: UserRole.ADMIN,
            status: 'ACTIVE',
        },
    });

    console.log('Created admin user:', admin);

    // Create sample projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Project Alpha',
            description: 'First sample project',
            status: 'ACTIVE',
            createdBy: admin.id,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'Project Beta',
            description: 'Second sample project',
            status: 'ACTIVE',
            createdBy: admin.id,
        },
    });

    console.log('Created projects:', project1, project2);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
