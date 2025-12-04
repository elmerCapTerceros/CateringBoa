import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { PrismaService } from 'src/providers/prisma/prisma.service';
import { User } from 'src/core/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) { }


  async registerUser(dto: RegisterUserDto): Promise<any> {
    this.logger.log(`POST: user/register: Register user started`);
    // Check if password and passwordConfirmation match
    if (dto.password !== dto.passwordconf) throw new BadRequestException('Passwords do not match');

    //Data to lower case
    dto.email = dto.email.toLowerCase().trim();
    // dto.name = dto.name.toLowerCase();


    //Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      
      const {passwordconf , ...newUserData} = dto
      newUserData.password = hashedPassword;

      const newuser = await this.prisma.user.create({
        data: newUserData,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
        }
      });

      return {
        user: newuser,
        token: this.getJwtToken({
          id: newuser.id, email: newuser.email, roles: newuser.role, purpose: 'sign up'
        }, this.configService.get('ACCESS_TOKEN_VALIDITY'), this.configService.get('JWT_SECRET'))
      };
      
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.warn(`POST: auth/register: User already exists: ${dto.email}`);
        throw new BadRequestException('User already exists');
      }
      this.logger.error(`POST: auth/register: error: ${error}`);
      throw new InternalServerErrorException('Server error');
    }

  }


  async loginUser(email: string, password: string): Promise<any> {
    this.logger.log(`POST: auth/login: Login iniciado: ${email}`);
    let user;
    try {
      user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          avatar: true,
          role: true,
          createdAt: true,
        }
      });

    } catch (error) {
      this.logger.error(`POST: auth/login: error: ${error}`);
      throw new BadRequestException('Wrong credentials');
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    const { password: _, ...data } = user;
    //delete user.password;
    
    this.logger.log(`POST: auth/login: Usuario aceptado: ${data.email}`);
    return {
      user: data,
      accessToken: this.getJwtToken({
        id: data.id, email: data.email, roles: data.role, purpose: 'sign in'
      }, this.configService.get('ACCESS_TOKEN_VALIDITY'), this.configService.get('JWT_SECRET')),
      refreshToken: this.getJwtToken({
        id: data.id, email: data.email, roles: data.role, purpose: 'refresh'
      }, this.configService.get('ACCESS_TOKEN_VALIDITY'), this.configService.get('JWT_SECRET'))
    };
  }

  async signInWithToken(accessToken: string): Promise<any> {


    try {

      const payload = await this.jwtService.verifyAsync(accessToken, { secret: this.configService.get('JWT_SECRET') });

      if ( !['sign in','sign up'].includes(payload.purpose) ) throw new UnauthorizedException('El token de inicio de sesión proporcionado no es válido');

      //const user = await this.userRepository.findOne({ where: { email: payload.email } });
      //const user = await this.authService.findOneByEmail(payload.email);

      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: payload.email
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          avatar: true,
          role: true,
          createdAt: true,
        }
      });

      if (!user) throw new UnauthorizedException('Usuario no encontrado.');

      return {
        user,
        accessToken: this.getJwtToken({
          id: user.id, email: user.email, roles: user.role, purpose: 'sign in'
        }, this.configService.get('ACCESS_TOKEN_VALIDITY'), this.configService.get('JWT_SECRET')),
        refreshToken: this.getJwtToken({
          id: user.id, email: user.email, roles: user.role, purpose: 'refresh'
        }, this.configService.get('ACCESS_TOKEN_VALIDITY'), this.configService.get('JWT_SECRET'))
      };

    } catch (error) {
      throw new UnauthorizedException('Token de inicio de sesión inválido');
    }
  }


  async refreshToken(user: User){

    return {
      user: user,
      token: this.getJwtToken({id: user.id, email: user.email, roles: user.role, purpose: 'refresh'}, this.configService.get('ACCESS_TOKEN_VALIDITY'), this.configService.get('JWT_SECRET'))
    };

  }


  private getJwtToken(payload: JwtPayload, expiresIn: number, secret: string) {

    return this.jwtService.sign(payload, { expiresIn, secret });

  }


}





