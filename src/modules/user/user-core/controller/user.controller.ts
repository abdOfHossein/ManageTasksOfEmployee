import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBasicAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { SuccessDto } from 'src/common/result/success.dto';
import { HashService } from 'src/modules/hash/hash.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { DataSource } from 'typeorm';
import { JwtGuard } from '../../modules/auth/guards/jwt.guard';
import { JwtStrategy } from '../../modules/auth/strategy/jwt.strategy';
import { CreateUserDto } from '../../modules/dtos/create.user.dto';
import { LoginUserDto } from '../../modules/dtos/login.user.dto';
import { UpdateUserDto } from '../../modules/dtos/update.user.dto';
import { UserEnt } from '../../modules/entities/User.entity';
import { UserPageDto } from '../../modules/paginations/user.page.dto';
import { UserRepo } from '../../modules/repositories/user.repository';
import { UserService } from '../../modules/services/User.service';


@ApiTags('User')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('User')
export class UserController {
  PREFIX_TOKEN_AUTH = "prefix_auth_token_"
  constructor(
    private user: UserService

  ) {}

  //register
  @Post('/register')
  register(
    @Query('id_department') id_department: string,
    @Query('id_role') id_role: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEnt> {
    createUserDto.id_department = id_department;
    createUserDto.id_role = id_role;
    return this.user._create(createUserDto);
  }

  //login
  @Post('login')
  login( @Body() loginUserDto: LoginUserDto): Promise<Object> {
    return this.user._createJwt(loginUserDto);
  }

  @ApiBasicAuth()
  @UseGuards(JwtStrategy)
  @Get('/protected')
  sayHello(): string {
    return "ok";
  }

  //update
  @Put()
  updateArch(
    @Query('id_user') id_user: string,
    @Query('id_department') id_department: string,
    @Query('id_role') id_role: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEnt> {
    updateUserDto.id_department = id_department;
    updateUserDto.id_role = id_role;
    return this.user._update(id_user, updateUserDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_User') id_User: string): Promise<SuccessDto> {
    return this.user._delete(id_User);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for user' })
  @Post('page')
  getPaginationArch(@Body() pageDto: UserPageDto): Promise<PageDto<UserEnt>> {
    return this.user._pagination(pageDto);
  }
}
