import * as bcrypt from 'bcrypt';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateProfileDTO } from './dtos/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    // repository injection
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  // updates a single user's profile
  async updateUserProfile({
    email,
    description,
    profileImage,
  }: UpdateProfileDTO): Promise<{ status: number }> {
    // find the user via email
    const user = await this.getUser(email);
    if (typeof user === 'boolean') return;
    user.description = description ? description : user.description;
    user.profileImage = profileImage ? profileImage : user.profileImage;

    try {
      await this.usersRepo.save(user);

      return { status: 200 };
    } catch (err) {
      throw new HttpException('Error updating the user to the DB', 404);
    }
  }

  // gets a single user with email
  async getUser(email: string, signup?: boolean): Promise<User | boolean> {
    try {
      const user = await this.usersRepo.findOne({
        where: { email },
        relations: ['following'],
      });
      if (!user && signup) {
        return false;
      }

      if (!user) {
        throw new NotFoundException(
          'No user was found with the email provided.',
        );
      }
      return user;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // gets a single user with id

  async getUserWithId(id: string): Promise<User> {
    try {
      const user = await this.usersRepo.findOne({
        where: { id: Number(id) },
        relations: ['following'],
      });
      return user;
    } catch (err) {
      throw new NotFoundException('No user was found with the id provided.');
    }
  }

  // gets list of all users
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.usersRepo.find();
      return users;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // signs up new user and saves to db
  async signup({ name, email, password }: CreateUserDTO): Promise<User> {
    // hash password before saving
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // find if user exists already to prevent duplicate users
      const user = await this.getUser(email, true);

      if (user) {
        throw new HttpException('User already exists', 500);
      }

      // create a new user
      const newUser = this.usersRepo.create({
        name,
        email,
        password: hashedPassword,
      });

      // save new user to db
      return await this.usersRepo.save(newUser);
    } catch (err) {
      // throw error if user can't be saved
      throw new HttpException(err.message, 500);
    }
  }

  // allows one user to follow another user via their email
  async followUser(id: string, email: string) {
    let updateMessage: string;

    // retrieve our user
    const user = await this.getUserWithId(id);

    // check if user even exists first and retrieve it
    const userToFollow = await this.getUser(email);

    // discontinue function if any of the user's dont' exist
    if (typeof user === 'boolean' || typeof userToFollow === 'boolean') return;

    // if it does, add it to this user's following list
    console.log("Current User's Folllowing:", user.following);

    if (!user.following) {
      // initialize following array if it doesn't exist
      user.following = [];
    } else {
      // check if user is already being followed
      const alreadyFollowed = user.following.find(
        (user) => user.email === email,
      );
      if (alreadyFollowed) {
        // remove user from following list
        const userIndex = user.following.indexOf(alreadyFollowed);
        user.following.splice(userIndex, 1);
        updateMessage = 'User unfollowed';
      } else {
        user.following = [...user.following, userToFollow];
        updateMessage = 'User followed';
      }
    }

    // save the user
    try {
      console.log('Current updated user', user);
      const savedUser = await this.usersRepo.save(user);
      return {
        status: 200,
        msg: updateMessage,
        user: savedUser,
      };
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }
}
