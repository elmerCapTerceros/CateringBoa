import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items') // <--- Esto genera la ruta /api/v1/items
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}