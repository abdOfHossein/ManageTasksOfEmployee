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
import { CreateReqDto } from '../../modules/dtos/create.req.dto';
import { UpdateReqDto } from '../../modules/dtos/update.req.dto';
import { ReqEnt } from '../../modules/entities/req.entity';
import { ReqPageDto } from '../../modules/paginations/req.page.dto';
import { ReqService } from '../../modules/services/req.service';

@ApiTags('Req')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('Req')
export class ReqController {
  constructor(private req: ReqService) {}

  //create
  @Post()
  createReq(
    @Query('project_id') project_id: string,
    @Body() createReqDto: CreateReqDto,
  ): Promise<Object> {
    createReqDto.project_id = project_id;
    return this.req._create(createReqDto);
  }

  //readOne
  @Get('/')
  getOneReq(@Query('id_req') id_req: string): Promise<Object> {
    return this.req._getOne(id_req);
  }

  //update
  @Put()
  updateArch(
    @Query('id_req') id_req: string,
    @Query('project_id') project_id: string,
    @Body() updateReqDto: UpdateReqDto,
  ): Promise<ReqEnt> {
    updateReqDto.project_id = project_id;
    return this.req._update(id_req, updateReqDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_req') id_req: string): Promise<SuccessDto> {
    return this.req._delete(id_req);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for Req' })
  @Post('page')
  getPaginationArch(@Body() pageDto: ReqPageDto): Promise<PageDto<ReqEnt>> {
    return this.req._pagination(pageDto);
  }
}
