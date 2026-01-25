// import { UUIDV4 } from 'sequelize';
// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   ForeignKey,
//   BelongsTo,
// } from 'sequelize-typescript';
// import { TENANT_TABLE } from '../../../private/tenant/models/tenant.model';
// import { Truck, TRUCKS_TABLE } from '../../trucks/models/trucks.model';

// export const TRACKINGS_TABLE = 'trackings';

// @Table({
//   timestamps: false,
//   tableName: TRACKINGS_TABLE,
// })
// export class Tracking extends Model {
//   @Column({
//     autoIncrement: false,
//     primaryKey: true,
//     type: DataType.STRING(36),
//     defaultValue: UUIDV4(),
//     field: 'tracking_id',
//     allowNull: false,
//   })
//   trackingId: string;

//   @ForeignKey(() => Truck)
//   @Column({
//     type: DataType.STRING(36),
//     field: 'truck_id',
//     references: {
//       model: TRUCKS_TABLE,
//       key: 'truck_id',
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'SET NULL',
//   })
//   truckId: string;

//   @Column({
//     type: DataType.STRING(20),
//     allowNull: false,
//     unique: true,
//   })
//   name: string;

//   @Column({
//     type: DataType.STRING(20),
//     allowNull: false,
//     unique: true,
//   })
//   imei: string;

//   @Column({
//     type: DataType.STRING(150),
//   })
//   description?: string;

//   @Column({
//     type: DataType.STRING(36),
//     field: 'tenant_id',
//     references: {
//       model: TENANT_TABLE,
//       key: 'tenant_id',
//     },
//     onUpdate: 'CASCADE',
//     onDelete: 'SET NULL',
//   })
//   tenantId?: string;

//   @Column({
//     allowNull: false,
//     type: DataType.DATEONLY,
//     field: 'created_at',
//     defaultValue: new Date(),
//   })
//   createdAt: Date;

//   @Column({
//     allowNull: false,
//     type: DataType.DATEONLY,
//     field: 'updated_at',
//     defaultValue: new Date(),
//   })
//   updatedAt: Date;

//   @BelongsTo(() => Truck) Truck: Truck;
// }