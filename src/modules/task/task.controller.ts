import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from '@database/typeorm/entities/task.entity';

@ApiTags('tasks')
@Controller('v1/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo mới một công việc' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Công việc được tạo thành công',
    type: Task,
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách công việc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Danh sách công việc',
    type: [Task],
  })
  async findAll(@Query() filterTaskDto: FilterTaskDto): Promise<Task[]> {
    return this.taskService.findAll(filterTaskDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết một công việc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Chi tiết công việc',
    type: Task,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật thông tin công việc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật công việc thành công',
    type: Task,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa một công việc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xóa công việc thành công',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.taskService.remove(id);
  }
}
