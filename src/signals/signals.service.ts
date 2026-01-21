import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { Signal, SignalStatus } from "./entities/signal.entity";
import { CreateSignalDto } from "./dto/create-signal.dto";

@Injectable()
export class SignalsService {
  private readonly logger = new Logger(SignalsService.name);

  constructor(
    @InjectRepository(Signal)
    private readonly signalRepository: Repository<Signal>,
    @InjectQueue("signal-validation")
    private readonly validationQueue: Queue,
  ) {}

  async create(createSignalDto: CreateSignalDto): Promise<Signal> {
    const signal = this.signalRepository.create({
      ...createSignalDto,
      status: SignalStatus.PENDING,
    });

    const savedSignal = await this.signalRepository.save(signal);

    // Enqueue validation job
    await this.validationQueue.add(
      "validate",
      { signalId: savedSignal.id },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    );

    this.logger.log(`Signal ${savedSignal.id} created and validation enqueued`);
    return savedSignal;
  }

  async findOne(id: string): Promise<Signal | null> {
    return this.signalRepository.findOneBy({ id });
  }

  async findAll(): Promise<Signal[]> {
    return this.signalRepository.find({
      order: { createdAt: "DESC" },
    });
  }
}
