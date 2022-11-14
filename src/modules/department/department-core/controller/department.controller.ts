import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { SuccessDto } from 'src/common/result/success.dto';
import { CreateDepartmentDto } from '../../modules/dtos/create.department.dto';
import { UpdateDepartmentDto } from '../../modules/dtos/update.department.dto';
import { DepartmentEnt } from '../../modules/entities/department.entity';
import { DepartmentPageDto } from '../../modules/paginations/department.page.dto';
import { DepartmentService } from '../../modules/services/department.service';

@ApiTags('Department')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('Department')
export class DepartmentController {
  constructor(private department: DepartmentService) {}

  //create
  @Post()
  createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Object> {
    return this.department._create(createDepartmentDto);
  }

  //readOne
  @Get('/')
  getOneDepartment(
    @Query('id_department') id_department: string,
  ): Promise<Object> {
    return this.department._getOne(id_department);
  }

  //update
  @Put()
  updateArch(
    @Query('id_Department') id_Department: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentEnt> {
    return this.department._update(id_Department, updateDepartmentDto);
  }

  //delete
  @Delete()
  deleteArch(
    @Query('id_Department') id_Department: string,
  ): Promise<SuccessDto> {
    return this.department._delete(id_Department);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for department' })
  @Post('page')
  getPaginationArch(
    @Body() pageDto: DepartmentPageDto,
  ): Promise<PageDto<DepartmentEnt>> {
    return this.department._pagination(pageDto);
  }
}
