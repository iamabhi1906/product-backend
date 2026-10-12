import { User } from '@/src/users/entities/user.entity';
import { UserRole } from '@/src/users/enums/user-role.enum';
import { setSeederFactory } from 'typeorm-extension';

const userFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = user.email = faker.internet.email().toLowerCase();
  user.password = `$2b$10$OmNwJ5X1.tvTwMiRXZ9ZNe7IcI2yHLX2FSpsiUsTaHAMp2ZuMyq4G`;
  user.avatar = faker.image.avatar();
  user.role = faker.helpers.enumValue(UserRole);
  user.isBlocked =
    faker.helpers.maybe(() => true, { probability: 0.1 }) ?? false;
  return user;
});

export default userFactory;
