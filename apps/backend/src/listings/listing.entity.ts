import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  OTHER = 'OTHER'
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.APARTMENT
  })
  propertyType: PropertyType;

  @Column('decimal', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column('int')
  bedrooms: number;

  @Column('decimal', { precision: 3, scale: 1 })
  bathrooms: number;

  @Column('int')
  squareFeet: number;

  @Column('int', { nullable: true })
  yearBuilt: number;

  @Column('jsonb', { default: [] })
  images: Array<{ url: string; name: string }>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
