import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.entity';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private projectsRepository: ProjectsRepository,
  ) {}

  createProject(
    createProjectDto: CreateProjectDto,
    customerId: string,
    user: User,
  ): Promise<Project> {
    return this.projectsRepository.createProject(createProjectDto, customerId, user);
  }
}
