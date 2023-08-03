import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workspace } from './Workspace';

@Entity({ name: 'api_tokens' })
export class ApiToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  token: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.apiTokens, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
  workspace: Workspace;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;
}
