import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { SuccessDto } from 'src/common/result/success.dto';
import { CreateRoleDto } from '../../modules/dtos/create.role.dto';
import { RoleEnt } from '../../modules/entities/role.entity';
import { RolePageDto } from '../../modules/paginations/role.page.dto';
import { RoleService } from '../../modules/services/role.service';

@ApiTags('Role')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('Role')
export class RoleController {
  constructor(private role: RoleService) {}

  //create
  @Post('/')
  register(@Body() createRoleDto: CreateRoleDto): Promise<RoleEnt> {
    return this.role._create(createRoleDto);
  }

  
  //readOne
  @Get('/')
  readOne(@Query('role_id') role_id: string): Promise<Object> {
    return this.role._getOne(role_id);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_Role') id_Role: string): Promise<SuccessDto> {
    return this.role._delete(id_Role);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for Role' })
  @Post('page')
  getPaginationArch(@Body() pageDto: RolePageDto): Promise<PageDto<RoleEnt>> {
    return this.role._pagination(pageDto);
  }
}
