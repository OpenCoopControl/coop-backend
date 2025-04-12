import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { email, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const connectionId = Math.floor(
      1000000 + Math.random() * 9000000,
    ).toString();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      connectionId,
      verificationToken,
      verificationTokenExpires,
      isEmailVerified: false,
      devices: [],
    });

    const savedUser = await newUser.save();
    await this.emailService.sendVerificationEmail(email, verificationToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passwordToExclude, ...result } = savedUser.toObject();
    return result;
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByConnectionId(connectionId: string): Promise<User | null> {
    return this.userModel.findOne({ connectionId }).exec();
  }
}
