import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { SimulationModule } from './simulation/simulation.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [
    ArticlesModule,
    SimulationModule,
    MarketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
