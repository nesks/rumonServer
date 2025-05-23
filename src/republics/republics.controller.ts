import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RepublicsService } from './republics.service';
import { CreateRepublicDto } from './dto/create-republic.dto';
import { UpdateRepublicDto } from './dto/update-republic.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('republics')
@UseGuards(JwtAuthGuard)
export class RepublicsController {
  constructor(private readonly republicsService: RepublicsService) {}

  @Post()
  create(@Body() createRepublicDto: CreateRepublicDto) {
    return this.republicsService.create(createRepublicDto);
  }

  @Get()
  findAll() {
    return this.republicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.republicsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepublicDto: UpdateRepublicDto) {
    return this.republicsService.update(id, updateRepublicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.republicsService.remove(id);
  }
} 