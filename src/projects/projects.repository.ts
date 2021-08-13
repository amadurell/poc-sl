import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CustomersRepository } from 'src/customers/customers.repository';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectsRepository extends Repository<Project> {
  constructor(private customersRepository: CustomersRepository) {
    super();
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    customerId: string,
    user: User,
  ): Promise<Project> {
    const { field1 } = createProjectDto;

    const customer = await this.customersRepository.findOne({ id: customerId });

    if (!customer.users.some((owner) => owner.id === user.id)) {
      throw new UnauthorizedException(
        `The current user is not authorized to act on this customer's projects.`,
      );
    }

    let project = this.create({
      field1,
      customer,
    });

    try {
      await this.save(project);
      return project;
    } catch (error) {
      console.log(error);
      switch (error.code) {
        default: {
          break;
        }
      }
    }
  }
}
