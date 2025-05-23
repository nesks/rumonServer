import { PartialType } from '@nestjs/mapped-types';
import { CreateRepublicDto } from './create-republic.dto';

export class UpdateRepublicDto extends PartialType(CreateRepublicDto) {} 