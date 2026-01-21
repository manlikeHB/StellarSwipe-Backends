import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { Signal } from "./entities/signal.entity";
import { SignalsService } from "./signals.service";
import { SignalsController } from "./signals.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Signal]),
    BullModule.registerQueue({
      name: "signal-validation",
    }),
  ],
  providers: [SignalsService],
  controllers: [SignalsController],
  exports: [SignalsService, TypeOrmModule],
})
export class SignalsModule {}
