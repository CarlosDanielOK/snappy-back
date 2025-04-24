import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interests.entity';
import { CreateInterestDTO, UpdateInterestDTO } from './dto/interests.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest) private interestsRepository: Repository<Interest>,
  ) { }

  async create(interestData: CreateInterestDTO): Promise<Interest> {
    const interest = this.interestsRepository.create(interestData);
    return this.interestsRepository.save(interest);
  }

  async getAll(): Promise<Interest[]> {
    return this.interestsRepository.find({ where: { active: true } });
  }

  async getAllAdmin(): Promise<Interest[]> {
    return this.interestsRepository.find();
  }

  async getById(id: string): Promise<Interest> {
    const interest = await this.interestsRepository.findOne({ where: { interest_id: id } });
    if (!interest) {
      throw new NotFoundException(`No se encontró el interés con el ID ${id}`);
    }
    return interest;
  }

  async update(id: string, interestData: UpdateInterestDTO): Promise<Interest> {
    const interest = await this.getById(id);
    if (interestData.name) {
      interest.name = interestData.name;
    }

    interest.active = interestData.active;

    return this.interestsRepository.save(interest);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.interestsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el interés con el ID ${id}`);
    }
    return { message: `Interest con ID ${id} eliminada correctamente` };

  }
}
