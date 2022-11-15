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
import { CreateDepartmentRlDto } from '../../modules/dtos/create.department-rl.dto';
import { UpdateDepartmentRlDto } from '../../modules/dtos/update.department-rl.dto';
import { DepartmentRlEnt } from '../../modules/entities/department-rl.entity';
import { DepartmentRlPageDto } from '../../modules/paginations/department-rl.page.dto';
import { DepartmentRlService } from '../../modules/services/department-rl.service';

@ApiTags('DepartmentRl')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('DepartmentRl')
export class DepartmentRlController {
  constructor(private departmentRl: DepartmentRlService) {}

  //create
  @Post()
  createDepartmentRl(
    @Query('req_id') req_id: string,
    @Query('department_id') department_id: string,
    @Body() createDepartmentRlDto: CreateDepartmentRlDto,
  ): Promise<Object> {
    createDepartmentRlDto.req_id = req_id;
    createDepartmentRlDto.department_id = department_id;
    return this.departmentRl._create(createDepartmentRlDto);
  }

  //readOne
  @Get('/')
  getOneDepartmentRl(
    @Query('id_departmentRl') id_departmentRl: string,
  ): Promise<Object> {
    return this.departmentRl._getOne(id_departmentRl);
  }

  //update
  @Put()
  updateArch(
    @Query('id_DepartmentRl') id_DepartmentRl: string,
    @Query('req_id') req_id: string,
    @Query('department_id') department_id: string,
    @Body() updateDepartmentRlDto: UpdateDepartmentRlDto,
  ): Promise<DepartmentRlEnt> {
    updateDepartmentRlDto.req_id = req_id;
    updateDepartmentRlDto.department_id = department_id;
    return this.departmentRl._update(id_DepartmentRl, updateDepartmentRlDto);
  }

  //delete
  @Delete()
  deleteArch(
    @Query('id_departmentRl') id_departmentRl: string,
  ): Promise<SuccessDto> {
    return this.departmentRl._delete(id_departmentRl);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for DepartmentRl' })
  @Post('page')
  getPaginationArch(
    @Body() pageDto: DepartmentRlPageDto,
  ): Promise<PageDto<DepartmentRlEnt>> {
    return this.departmentRl._pagination(pageDto);
  }
}
