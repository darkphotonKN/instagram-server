import { Image } from 'src/images/entities/image.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // user personal description
  @Column({ default: '' })
  description: string;

  // profile pic
  @Column({ nullable: true })
  profileImage: string;

  // TEMP: without relation
  // @Column({ default: 237 })
  // followers: number;

  // @Column({ default: 102 })
  // following: number;

  // @Column('text', { array: true, nullable: true })
  // images: string[];

  // TODO: with relation
  // // list of followers
  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  // // list of following
  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  following: User[];

  // // list of posted images
  @OneToMany(() => Image, (image) => image.user)
  images: Image[];
}
