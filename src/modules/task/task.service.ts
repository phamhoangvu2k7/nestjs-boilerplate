import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Task } from '@database/typeorm/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAll(filterTaskDto?: FilterTaskDto): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = {};

    if (filterTaskDto?.isCompleted !== undefined) {
      where.isCompleted = filterTaskDto.isCompleted;
    }

    if (filterTaskDto?.category) {
      where.category = filterTaskDto.category;
    }

    return await this.taskRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<{ message: string }> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
