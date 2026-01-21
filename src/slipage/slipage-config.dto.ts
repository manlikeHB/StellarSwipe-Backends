import { IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SlippageToleranceLevel {
  STRICT = 'STRICT',
  MODERATE = 'MODERATE',
  RELAXED = 'RELAXED',
}

export class SlippageConfigDto {
  @ApiProperty({
    description: 'Maximum allowed slippage percentage (0-100)',
    example: 0.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  maxSlippagePercent: number;

  @ApiPropertyOptional({
    description: 'Predefined slippage tolerance level',
    enum: SlippageToleranceLevel,
    example: SlippageToleranceLevel.MODERATE,
  })
  @IsOptional()
  @IsEnum(SlippageToleranceLevel)
  toleranceLevel?: SlippageToleranceLevel;

  @ApiPropertyOptional({
    description: 'Enable automatic slippage adjustment based on market conditions',
    example: true,
  })
  @IsOptional()
  enableDynamicSlippage?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum execution time in milliseconds before considering price stale',
    example: 5000,
    minimum: 100,
    maximum: 30000,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(30000)
  maxExecutionTimeMs?: number;
}

export class SlippageEstimationDto {
  @ApiProperty({
    description: 'Symbol/trading pair',
    example: 'BTC/USD',
  })
  symbol: string;

  @ApiProperty({
    description: 'Trade side (buy/sell)',
    example: 'buy',
  })
  side: 'buy' | 'sell';

  @ApiProperty({
    description: 'Order size/quantity',
    example: 1.5,
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Expected price for the trade',
    example: 45000.50,
  })
  @IsOptional()
  @IsNumber()
  expectedPrice?: number;
}

export class SlippageReportDto {
  @ApiProperty({
    description: 'Expected price before execution',
    example: 45000.00,
  })
  expectedPrice: number;

  @ApiProperty({
    description: 'Actual execution price',
    example: 45022.50,
  })
  actualPrice: number;

  @ApiProperty({
    description: 'Slippage amount in currency units',
    example: 22.50,
  })
  slippageAmount: number;

  @ApiProperty({
    description: 'Slippage percentage',
    example: 0.05,
  })
  slippagePercent: number;

  @ApiProperty({
    description: 'Trade quantity',
    example: 1.5,
  })
  quantity: number;

  @ApiProperty({
    description: 'Total cost impact of slippage',
    example: 33.75,
  })
  totalSlippageCost: number;

  @ApiProperty({
    description: 'Whether slippage was within acceptable limits',
    example: true,
  })
  withinLimits: boolean;

  @ApiProperty({
    description: 'Timestamp of the report',
    example: '2026-01-21T10:30:00Z',
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Trading symbol',
    example: 'BTC/USD',
  })
  symbol: string;

  @ApiProperty({
    description: 'Trade side',
    example: 'buy',
  })
  side: 'buy' | 'sell';
}

export class SlippageEstimateResponseDto {
  @ApiProperty({
    description: 'Estimated slippage percentage',
    example: 0.12,
  })
  estimatedSlippagePercent: number;

  @ApiProperty({
    description: 'Estimated slippage amount',
    example: 54.00,
  })
  estimatedSlippageAmount: number;

  @ApiProperty({
    description: 'Current market price',
    example: 45000.00,
  })
  currentMarketPrice: number;

  @ApiProperty({
    description: 'Estimated execution price range',
    example: { min: 44946.00, max: 45054.00 },
  })
  estimatedPriceRange: {
    min: number;
    max: number;
  };

  @ApiProperty({
    description: 'Market liquidity indicator (0-1, higher is better)',
    example: 0.85,
  })
  liquidityScore: number;

  @ApiProperty({
    description: 'Recommended action based on current conditions',
    example: 'proceed',
  })
  recommendation: 'proceed' | 'caution' | 'delay';

  @ApiProperty({
    description: 'Reasoning for the recommendation',
    example: 'Market conditions are favorable with good liquidity',
  })
  reasoning: string;
}