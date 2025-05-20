import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async preRegister(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { phone: createUserDto.phone },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Email ou telefone já cadastrado');
    }

    const activationToken = crypto.randomBytes(32).toString('hex');
    
    const user = this.usersRepository.create({
      ...createUserDto,
      activationToken,
      isActive: false,
    });

    await this.usersRepository.save(user);

    // Aqui você implementaria o envio do token por email e SMS
    return {
      message: 'Pré-cadastro realizado com sucesso',
      userId: user.id,
    };
  }

  async setPassword(activationToken: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { activationToken },
    });

    if (!user) {
      throw new NotFoundException('Token inválido');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    user.password = hashedPassword;
    user.activationToken = "";
    user.isActive = true;

    await this.usersRepository.save(user);

    return { message: 'Senha definida com sucesso' };
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }
} 