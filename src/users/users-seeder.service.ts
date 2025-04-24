import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, userRole } from './entities/user.entity';
import * as dataInterests from '../assets/interests-seed.json';
import * as dataUsers from '../assets/users-seed.json';
import * as bcrypt from "bcrypt";
import { Interest } from 'src/interests/entities/interests.entity';

@Injectable()
export class UsersSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Interest) private readonly interestRepository: Repository<Interest>,
    ) { }

    async onModuleInit() {
        await this.seedInterests();
        await this.seedUsers();
    }

    async seedInterests() {
        const interestCount = await this.interestRepository.count();
        if (interestCount > 0) {
            console.log('Ya existen intereses en la base de datos.');
            return;
        }

        const interests = dataInterests.map((element) => ({
            name: element.name,
        }));

        await this.interestRepository
            .createQueryBuilder()
            .insert()
            .into(Interest)
            .values(interests)
            .execute();

        console.log('Intereses precargados exitosamente.');
    }

    async seedUsers() {
        const userCount = await this.userRepository.count();
        if (userCount > 0) {
            console.log('Ya existen usuarios en la base de datos.');
            return;
        }

        const superadminUsername = process.env.SUPERADMIN_USER;
        const superadminPassword = process.env.SUPERADMIN_PASSWORD;
        const superadminEmail = process.env.SUPERADMIN_EMAIL;

        const hashedPassword = await bcrypt.hash(superadminPassword, 10);

        const superadmin = this.userRepository.create({
            fullname: 'Snappy Friends',
            username: superadminUsername,
            email: superadminEmail,
            password: hashedPassword,
            profile_image: '/no_img.png',
            birthdate: '2000-01-01',
            genre: 'SNAPPY',
            user_role: userRole.SUPERADMIN
        });

        await this.userRepository.save(superadmin);

        const allInterests = await this.interestRepository.find();

        const users = [];
        for (const element of dataUsers) {
            const interests = allInterests.filter(interest =>
                element.interests.includes(interest.name)
            );

            let location = null;
            if (element.location) {
                const { x, y } = element.location;
                location = `${x},${y}`;
            }

            const user = this.userRepository.create({
                fullname: element.fullname,
                username: element.username,
                email: element.email,
                password: element.password,
                profile_image: element.profile_image,
                birthdate: element.birthdate,
                genre: element.genre,
                interests: interests,
                location: location
            });

            users.push(user);
        }

        await this.userRepository.save(users);

        console.log('Usuarios precargados exitosamente.');
    }
}
