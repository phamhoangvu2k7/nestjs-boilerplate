import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoàn thành',
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
