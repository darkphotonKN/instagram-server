import { Image } from 'src/images/entities/image.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // list of followers
  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  // list of following
  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  following: User[];

  // list of posted images
  @OneToMany(() => Image, (image) => image.user)
  images: Image[];
}
