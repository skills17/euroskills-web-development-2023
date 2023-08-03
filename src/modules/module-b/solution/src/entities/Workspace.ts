import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { ApiToken } from './ApiToken';
import { BillingQuota } from './BillingQuota';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description?: string;

  @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  user: User;

  @OneToMany(() => ApiToken, (apiToken) => apiToken.workspace)
  apiTokens: ApiToken[];

  @OneToOne(() => BillingQuota, (billingQuota) => billingQuota.workspace, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  billingQuota?: BillingQuota;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
