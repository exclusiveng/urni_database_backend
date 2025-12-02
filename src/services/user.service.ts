import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { DuplicateLog } from '../entities/DuplicateLog';
import * as xlsx from 'xlsx';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private duplicateLogRepository = AppDataSource.getRepository(DuplicateLog);

  async createUser(data: Partial<User>) {
    const { phone } = data;

    if (!phone) {
      throw new Error('Phone number is required');
    }

    // Check if user exists by phone
    const existingUser = await this.userRepository.findOne({ where: { phone } });

    if (existingUser) {
      // Handle duplicate
      let duplicateLog = await this.duplicateLogRepository.findOne({ where: { identifier: phone } });

      if (duplicateLog) {
        duplicateLog.count += 1;
        duplicateLog.data = data;
        await this.duplicateLogRepository.save(duplicateLog);
      } else {
        duplicateLog = this.duplicateLogRepository.create({
          identifier: phone,
          count: 1,
          data: data,
        });
        await this.duplicateLogRepository.save(duplicateLog);
      }

      return { status: 'duplicate', message: 'User already exists, logged as duplicate' };
    }

    // Create new user
    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);
    return { status: 'success', user: newUser };
  }

  async processBulkUpload(fileBuffer: Buffer) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    for (const row of jsonData) {
      try {
        // Map Excel columns to User entity fields if necessary, assuming headers match
        const userData: Partial<User> = {
          firstName: row.firstName,
          lastName: row.lastName,
          age: row.age,
          location: row.location,
          email: row.email,
          phone: row.phone, // Ensure phone is treated as string
          event: row.event,
        };

        // Basic validation for phone
        if (!userData.phone) {
            errorCount++;
            continue;
        }
        // Convert phone to string if it was parsed as number
        userData.phone = String(userData.phone);

        const result = await this.createUser(userData);
        if (result.status === 'success') {
          successCount++;
        } else {
          duplicateCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    return { successCount, duplicateCount, errorCount };
  }

  async getUsers(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
