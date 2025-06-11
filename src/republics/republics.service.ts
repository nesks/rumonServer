import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Republic } from './entities/republic.entity';
import { Casa } from './entities/casa.entity';
import { CreateRepublicDto } from './dto/create-republic.dto';
import { UpdateRepublicDto } from './dto/update-republic.dto';

@Injectable()
export class RepublicsService {
  constructor(
    @InjectRepository(Republic)
    private republicsRepository: Repository<Republic>,
    @InjectRepository(Casa)
    private casasRepository: Repository<Casa>,
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
      relations: ['users', 'casa', 'usuarioRumon'],
    });

    if (!republic) {
      throw new NotFoundException(`República com ID ${id} não encontrada`);
    }

    return republic;
  }

  async update(id: string, updateRepublicDto: UpdateRepublicDto) {
    const republic = await this.findOne(id);
    
    // Filtra e transforma apenas os campos que devem ser atualizados
    const fieldsToUpdate: any = {};
    
    // Campos de texto simples
    if (updateRepublicDto.name && updateRepublicDto.name.trim() !== '') {
      fieldsToUpdate.name = updateRepublicDto.name.trim();
    }
    
    if (updateRepublicDto.address && updateRepublicDto.address.trim() !== '') {
      fieldsToUpdate.address = updateRepublicDto.address.trim();
    }
    
    if (updateRepublicDto.description && updateRepublicDto.description.trim() !== '') {
      fieldsToUpdate.description = updateRepublicDto.description.trim();
    }
    
    if (updateRepublicDto.linkFoto && updateRepublicDto.linkFoto.trim() !== '') {
      fieldsToUpdate.linkFoto = updateRepublicDto.linkFoto.trim();
    }
    
    if (updateRepublicDto.foto_capa && updateRepublicDto.foto_capa.trim() !== '') {
      fieldsToUpdate.foto_capa = updateRepublicDto.foto_capa.trim();
    }
    
    if (updateRepublicDto.instagram && updateRepublicDto.instagram.trim() !== '') {
      fieldsToUpdate.instagram = updateRepublicDto.instagram.trim();
    }
    
    if (updateRepublicDto.hino && updateRepublicDto.hino.trim() !== '') {
      fieldsToUpdate.hino = updateRepublicDto.hino.trim();
    }
    
    if (updateRepublicDto.linkEstatutoPdf && updateRepublicDto.linkEstatutoPdf.trim() !== '') {
      fieldsToUpdate.linkEstatutoPdf = updateRepublicDto.linkEstatutoPdf.trim();
    }
    
    // Campo tipo - transforma para lowercase se não estiver vazio
    if (updateRepublicDto.tipo && updateRepublicDto.tipo.trim() !== '') {
      const tipoLower = updateRepublicDto.tipo.toLowerCase().trim();
      if (['masculina', 'feminina', 'mista'].includes(tipoLower)) {
        fieldsToUpdate.tipo = tipoLower;
      }
    }
    
    // Campo status - transforma para lowercase se não estiver vazio
    if (updateRepublicDto.status && updateRepublicDto.status.trim() !== '') {
      const statusLower = updateRepublicDto.status.toLowerCase().trim();
      if (['ativa', 'inativa', 'reformando', 'suspended'].includes(statusLower)) {
        fieldsToUpdate.status = statusLower;
      }
    }
    
    // Campo data - só atualiza se for uma data válida
    if (updateRepublicDto.fundada_em && updateRepublicDto.fundada_em.trim() !== '') {
      const date = new Date(updateRepublicDto.fundada_em.trim());
      if (!isNaN(date.getTime())) {
        fieldsToUpdate.fundada_em = date;
      }
    }
    
    // IDs - só atualiza se não estiver vazio
    if (updateRepublicDto.usuario_rumon_id && updateRepublicDto.usuario_rumon_id.trim() !== '') {
      fieldsToUpdate.usuario_rumon_id = updateRepublicDto.usuario_rumon_id.trim();
    }
    
    if (updateRepublicDto.casa_id && updateRepublicDto.casa_id.trim() !== '') {
      fieldsToUpdate.casa_id = updateRepublicDto.casa_id.trim();
    }
    
    // Só faz merge se houver campos para atualizar
    if (Object.keys(fieldsToUpdate).length > 0) {
      this.republicsRepository.merge(republic, fieldsToUpdate);
    }
    
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