import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { TaskBlockOperationEnt } from 'src/modules/task-cblock-operation/modules/entities/task-block-operation.entity';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateTaskDto } from '../dtos/create.task.dto';
import { UpdateTaskDto } from '../dtos/update.task.dto';
import { TaskEnt } from '../entities/task.entity';
import { TaskPageDto } from '../paginations/task.page.dto';
import { TaskRepo } from '../repositories/task.repository';
import { TaskCUDto } from '../result/task.c.u.dto';
import { TaskGDto } from '../result/task.g.dto';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepo, private dataSource: DataSource) {}

  //create
  async _create(createDt: CreateTaskDto, query?: QueryRunner) {
    try {
      return await this.taskRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create Task err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: TaskEnt) {
    return new TaskCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.taskRepo._findOneEntity(searchDto, options);
    } catch (e) {
      console.log('readOne Task err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: TaskEnt) {
    return new TaskGDto(ent);
  }

  //update
  async _update(Task_Id: string, updateDt: UpdateTaskDto, query?: QueryRunner) {
    try {
      const uerEnt = <TaskEnt>await this._getOne(Task_Id);
      return await this.taskRepo._updateEntity(uerEnt, updateDt, query);
    } catch (e) {
      console.log('update Task err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: TaskEnt) {
    return new TaskCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const taskEnt: any = await this._getOne(searchDto);
      if (!TaskEnt) {
        throw new BadGatewayException({ message: 'Task does not exits' });
      }

      //delete relation => task_block_operation
      await this.dataSource
        .getRepository(TaskBlockOperationEnt)
        .delete({ task: taskEnt });

      const result = await this.taskRepo._deleteEntity(taskEnt);
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete Task err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: TaskEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: TaskPageDto) {
    try {
      return await this.taskRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination Task err in service', e);
      throw e;
    }
  }
}
