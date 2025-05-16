import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe, Request, UseGuards, Put, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async register(@Body() createUserData: CreateUserDto) {
        try {
            return this.authService.send({cmd: 'register'}, createUserData);
        } catch (error) {
            return error;
        }
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async login(@Body() loginUserDara: LoginUserDto) {
        try {
            return this.authService.send({cmd: 'login'}, loginUserDara);
        } catch (error) {
            return error;
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        try {
            return this.authService.send({ cmd: 'get_profile' }, req.user.sub);
        } catch (error) {
            return error;
        }
    }

    @UseGuards(AuthGuard)
    @Put('profile')
    async updateProfile(@Request() req: any, @Body() updateUserData: any) {
        try {
            const userId = req.user.sub;
            return this.authService.send({ cmd: 'update_profile' }, {userId, updateUserData});
        } catch (error) {
            return error;
        }
    }

    @UseGuards(AuthGuard)
    @Delete('profile')
    async deleteProfile(@Request() req: any) {
        try {
            const userId = req.user.sub;
            return this.authService.send({ cmd: 'delete_profile' }, userId);
        } catch (error) {
            return error;
        }
    }
}
