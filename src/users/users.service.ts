import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSocialMedia } from './entities/user-social-media.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RepublicsService } from '../republics/republics.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserSocialMedia)
    private userSocialMediaRepository: Repository<UserSocialMedia>,
    private republicsService: RepublicsService,
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

    if (createUserDto.republic_id) {
      try {
        await this.republicsService.findOne(createUserDto.republic_id);
      } catch (error) {
        throw new NotFoundException('República não encontrada');
      }
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

  async getUserProfile(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['republic'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Buscar redes sociais separadamente
    const socialMedias = await this.userSocialMediaRepository.find({
      where: { user_id: id },
    });

    return {
      id: user.id,
      name: user.name,
      apelido: user.apelido,
      email: user.email,
      phone: user.phone,
      periodoIngresso: user.periodoIngresso,
      origem: user.origem,
      faculdade: user.faculdade,
      curso: user.curso,
      hierarquia: user.hierarquia,
      descricao: user.descricao,
      linkfotoPerfil: user.linkfotoPerfil,
      isActive: user.isActive,
      republicName: user.republic?.name || null,
      socialMedias: socialMedias || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Verificar se o usuário existe
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar se email já está em uso por outro usuário
    if (updateUserDto.email) {
      const existingUserByEmail = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new ConflictException('Email já em uso por outro usuário');
      }
    }

    // Verificar se telefone já está em uso por outro usuário
    if (updateUserDto.phone) {
      const existingUserByPhone = await this.usersRepository.findOne({
        where: { phone: updateUserDto.phone },
      });

      if (existingUserByPhone && existingUserByPhone.id !== id) {
        throw new ConflictException('Telefone já em uso por outro usuário');
      }
    }

    // Atualizar os dados do usuário
    Object.assign(user, updateUserDto);
    
    const updatedUser = await this.usersRepository.save(user);

    // Retornar usuário atualizado sem campos sensíveis
    const { password, activationToken, ...userResponse } = updatedUser;
    
    return userResponse;
  }
} 