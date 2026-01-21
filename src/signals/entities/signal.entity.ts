import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum SignalStatus {
  PENDING = "PENDING",
  VALIDATED = "VALIDATED",
  REJECTED = "REJECTED",
  FAILED = "FAILED",
}

@Entity("signals")
export class Signal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  assetPair!: string;

  @Column()
  action!: string; // e.g., BUY, SELL

  @Column("text")
  rationale!: string;

  @Column({ type: "int", nullable: true })
  validationScore!: number;

  @Column({
    type: "enum",
    enum: SignalStatus,
    default: SignalStatus.PENDING,
  })
  status!: SignalStatus;

  @Column({ type: "text", nullable: true })
  validationFeedback!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
