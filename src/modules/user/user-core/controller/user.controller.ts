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
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { SuccessDto } from 'src/common/result/success.dto';
import { LocalAuthGuard } from '../../modules/auth/local-auth.guard';
import { CreateUserDto } from '../../modules/dtos/create.user.dto';
import { LoginUserDto } from '../../modules/dtos/login.user.dto';
import { UpdateUserDto } from '../../modules/dtos/update.user.dto';
import { UserEnt } from '../../modules/entities/User.entity';
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
  register(@Body() createUserDto: CreateUserDto): Promise<UserEnt> {
    console.log('createUserDto controller', createUserDto);
    return this.user._create(createUserDto);
  }

  //login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Body() loginUserDto: LoginUserDto): Promise<Object> {
    return this.user._login(req.user);
  }

  @UseGuards()
  @Get('/protected')
  sayHello(@Request() req) {
    return req.user;
  }

  //update
  @Put()
  updateArch(
    @Query('id_user') id_user: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEnt> {
    return this.user._update(id_user, updateUserDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_User') id_User: string): Promise<SuccessDto> {
    return this.user._delete(id_User);
  }
}
