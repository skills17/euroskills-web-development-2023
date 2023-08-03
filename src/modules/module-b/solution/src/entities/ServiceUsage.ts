import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiToken } from './ApiToken';
import { Service } from './Service';

@Entity()
export class ServiceUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApiToken, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  apiToken: ApiToken;

  @ManyToOne(() => Service, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  service: Service;

  @Column()
  durationInMs: number;
}
