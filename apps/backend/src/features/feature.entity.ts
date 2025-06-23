import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Listing } from '../listings/listing.entity';

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @ManyToMany(() => Listing, listing => listing.features)
  @JoinTable({
    name: 'listing_features',
    joinColumn: { name: 'feature_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'listing_id', referencedColumnName: 'id' },
  })
  listings: Listing[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
