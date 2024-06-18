import { BaseEntity } from '../helpers/db.helpers';

type EntityConstructor<T> = { new (): T };

export const createEntity = async <T extends BaseEntity, U>(
  entityConstructor: EntityConstructor<T>,
  data: U,
  existingEntity?: T,
): Promise<T> => {
  const newEntity = new entityConstructor();

  Object.keys(data).forEach((key) => {
    newEntity[key as keyof T] =
      (data as any)[key] ??
      (existingEntity ? existingEntity[key as keyof T] : undefined);
  });

  return newEntity;
};
