import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Học NestJS cơ bản',
    description: 'Tiêu đề công việc, bắt buộc, độ dài 1 - 255 ký tự',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'Backend',
    description: 'Chủ đề của công việc',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @ApiPropertyOptional({
    example: 'Tìm hiểu về DTO, Controller, Service và Module',
    description: 'Mô tả chi tiết công việc',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
