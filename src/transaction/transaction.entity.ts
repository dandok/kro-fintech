import { ETransactionType } from '../@types/transaction.enum';
import { BaseEntity } from '../helpers/db.helpers';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Transaction extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @Column({
    type: 'enum',
    enum: ETransactionType,
  })
  type: ETransactionType;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ nullable: true })
  payment_method: string;

  @Column({ type: 'varchar' })
  ref: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
