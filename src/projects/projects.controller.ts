import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

@Controller({
  version: ['', 'v1', 'v2'],
  path: 'customers/:customerId/projects',
})
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Param() customerId: string,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.createProject(createProjectDto, customerId, user);
  }
}
