import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterTaskDto {
  @ApiPropertyOptional({
    description: 'Lọc các task hoàn thành hoặc chưa',
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true || value === 1 || value === '1')
      return true;
    if (value === 'false' || value === false || value === 0 || value === '0')
      return false;
    return value;
  })
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Lọc theo chủ đề công việc',
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
