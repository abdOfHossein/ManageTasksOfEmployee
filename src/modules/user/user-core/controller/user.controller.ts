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
import {
  ApiBasicAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { SuccessDto } from 'src/common/result/success.dto';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from '../../modules/auth/local-auth.guard';
import { CreateUserDto } from '../../modules/dtos/create.user.dto';
import { LoginUserDto } from '../../modules/dtos/login.user.dto';
import { UpdateUserDto } from '../../modules/dtos/update.user.dto';
import { UserEnt } from '../../modules/entities/User.entity';
import { UserPageDto } from '../../modules/paginations/user.page.dto';
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
  constructor(private user: UserService) {}

  //register
  @Post('/register')
  register(
    @Query('id_department') id_department: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEnt> {
    createUserDto.id_department=id_department
    return this.user._create(createUserDto);
  }

  //login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Body() loginUserDto: LoginUserDto): Promise<Object> {
    return this.user._login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBasicAuth()
  @Get('/protected')
  sayHello(@Request() req): string {
    return req.user;
  }

  //update
  @Put()
  updateArch(
    @Query('id_user') id_user: string,
    @Query('id_department') id_department: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEnt> {
    updateUserDto.id_department=id_department
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
