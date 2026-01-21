import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

const getJwtConfig = () => {
    const secret = process.env.JWT_SECRET as Secret | undefined;
    if (!secret) {
        throw new AppError('JWT_SECRET is not configured', 500);
    }

    const expiresInEnv = process.env.JWT_EXPIRES_IN;
    const expiresIn: SignOptions['expiresIn'] = expiresInEnv
        ? (expiresInEnv as unknown as SignOptions['expiresIn'])
        : '7d';

    return { secret, expiresIn };
};

export const authService = {
    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        if (user.status === 'INACTIVE') {
            throw new AppError('Account is deactivated', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const { secret, expiresIn } = getJwtConfig();

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        };
    },

    async createInvite(email: string, role: string, adminId: string) {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        // Check if there's a pending invite
        const pendingInvite = await prisma.invite.findFirst({
            where: {
                email,
                acceptedAt: null,
                expiresAt: { gt: new Date() },
            },
        });

        if (pendingInvite) {
            throw new AppError('Pending invite already exists for this email', 400);
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        // Set expiration
        const expirationHours = parseInt(process.env.INVITE_EXPIRATION_HOURS || '72');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expirationHours);

        const invite = await prisma.invite.create({
            data: {
                email,
                role: role as any,
                token,
                expiresAt,
            },
        });

        return {
            invite: {
                id: invite.id,
                email: invite.email,
                role: invite.role,
                token: invite.token,
                expiresAt: invite.expiresAt,
            },
            inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?token=${token}`,
        };
    },

    async registerViaInvite(token: string, name: string, password: string) {
        const invite = await prisma.invite.findUnique({ where: { token } });

        if (!invite) {
            throw new AppError('Invalid invite token', 400);
        }

        if (invite.acceptedAt) {
            throw new AppError('Invite has already been used', 400);
        }

        if (invite.expiresAt < new Date()) {
            throw new AppError('Invite has expired', 400);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: invite.email },
        });

        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: invite.email,
                name,
                password: hashedPassword,
                role: invite.role,
                status: 'ACTIVE',
                invitedAt: invite.createdAt,
            },
        });

        // Mark invite as accepted
        await prisma.invite.update({
            where: { id: invite.id },
            data: { acceptedAt: new Date() },
        });

        // Generate token
        const { secret, expiresIn } = getJwtConfig();

        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn }
        );

        return {
            token: jwtToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        };
    },

    async verifyInvite(token: string) {
        const invite = await prisma.invite.findUnique({ where: { token } });

        if (!invite) {
            throw new AppError('Invalid invite token', 400);
        }

        if (invite.acceptedAt) {
            throw new AppError('Invite has already been used', 400);
        }

        if (invite.expiresAt < new Date()) {
            throw new AppError('Invite has expired', 400);
        }

        return {
            email: invite.email,
            role: invite.role,
        };
    },
};
