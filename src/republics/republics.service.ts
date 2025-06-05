import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Republic } from './entities/republic.entity';
import { CreateRepublicDto } from './dto/create-republic.dto';
import { UpdateRepublicDto } from './dto/update-republic.dto';

@Injectable()
export class RepublicsService {
  constructor(
    @InjectRepository(Republic)
    private republicsRepository: Repository<Republic>,
  ) {}

  create(createRepublicDto: CreateRepublicDto) {
    const republic = this.republicsRepository.create(createRepublicDto);
    return this.republicsRepository.save(republic);
  }

  findAll() {
    return this.republicsRepository.find({
      select: ['id', 'name', 'description', 'linkFoto'],
    });
  }

  async findOne(id: string) {
    const republic = await this.republicsRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!republic) {
      throw new NotFoundException(`República com ID ${id} não encontrada`);
    }

    return republic;
  }

  async update(id: string, updateRepublicDto: UpdateRepublicDto) {
    const republic = await this.findOne(id);
    this.republicsRepository.merge(republic, updateRepublicDto);
    return this.republicsRepository.save(republic);
  }

  async remove(id: string) {
    const republic = await this.findOne(id);
    return this.republicsRepository.remove(republic);
  }

  async getRepublicUsers(id: string) {
    const republic = await this.republicsRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!republic) {
      throw new NotFoundException(`República com ID ${id} não encontrada`);
    }

    return republic.users.map(user => ({
      id: user.id,
      name: user.name,
      linkfotoPerfil: user.linkfotoPerfil || null,
    }));
  }
} 