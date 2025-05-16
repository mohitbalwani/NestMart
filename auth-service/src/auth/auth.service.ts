import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) { }

    async register(data: any) {
        try {
            const userExist = await this.userRepository.findOneBy({ email: data.email });
            if (userExist) {
                return 'User Already Exists !!!';
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            return this.userRepository.save(data);
        } catch (error) {
            return error;
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(data: any) {
        try {
            const user = await this.validateUser(data.email, data.password);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const payload = { sub: user.id, email: user.email };
            const access_token = await this.jwtService.signAsync(payload);
            return {
                'access_token': access_token
            }
        } catch (error) {
            return error;
        }
    }

    async getProfile(userId: number) {
        const user = this.userRepository.findOne({where: {id: userId}});
        if(!user) {
            throw new NotFoundException('User not found !!');
        }
        return user;
    }

    async updateProfile(data: any) {
        if(data.updateUserData.password) {
            data.updateUserData.password = await bcrypt.hash(data.updateUserData.password, 10);
        }
        await this.userRepository.update(data.userId, data.updateUserData);
        return this.getProfile(data.userId);
    }

    async deleteProfile(userId: any) {
        const result = await this.userRepository.delete(userId);
        return result;
    }

    async updateUserOrders(data: any) {
        const user = await this.userRepository.findOne({where: {
            id: data.userId
        }});

        if(!user) {
            throw new Error('User not found');
        }

        user.orderIds.push(data.orderId);
        return this.userRepository.save(user);
    }

    async cancelUserOrder(data: any) {
        const user = await this.userRepository.findOne({where: {
            id: data.userId
        }});

        if (!user) {
            throw new Error('User not found');
        }

        user.orderIds = user.orderIds.filter(orderId => orderId !== data.orderId);
        this.userRepository.save(user);
    }
}
