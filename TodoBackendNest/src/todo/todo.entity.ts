import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
  @PrimaryColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  task: string;

  @Column({ default: false, nullable: true})
  @ApiProperty({ required: false})
  checked: boolean;

  @ManyToOne(() => User, user => user.todos)
  user: User;
}
