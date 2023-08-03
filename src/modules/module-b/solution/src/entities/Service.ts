import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal' })
  costPerMs: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
