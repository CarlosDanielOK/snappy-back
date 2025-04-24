import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn('uuid')
  interest_id: string;

  @Column()
  name: string;


  @ManyToMany(() => User, (user) => user.interests)
  users: User[];

  @Column({
    type: 'boolean',
    default: true
  })
  active: boolean;
}
