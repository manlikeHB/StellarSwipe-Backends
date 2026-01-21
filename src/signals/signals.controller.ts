import { Controller, Post, Body, Get, Param, NotFoundException } from "@nestjs/common";
import { SignalsService } from "./signals.service";
import { CreateSignalDto } from "./dto/create-signal.dto";
import { Signal } from "./entities/signal.entity";

@Controller("signals")
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @Post()
  async create(@Body() createSignalDto: CreateSignalDto): Promise<Signal> {
    return this.signalsService.create(createSignalDto);
  }

  @Get()
  async findAll(): Promise<Signal[]> {
    return this.signalsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Signal> {
    const signal = await this.signalsService.findOne(id);
    if (!signal) {
      throw new NotFoundException(`Signal with ID ${id} not found`);
    }
    return signal;
  }
}
