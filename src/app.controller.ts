import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { ReservationDTO } from './types/Reservation.ts';
import { toCreateInfo } from './types/Reservation.js';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @Render('index')
    getHello() {
        return {};
    }

    @Post()
    @Render('index')
    async postHello(@Body() body: ReservationDTO) {
        const [info, errors] = toCreateInfo(body);
        if (info) {
            await this.appService.createReservation(info);
            return { success: true };
        }
        else {
            return { ...body, errors: errors.map(it => it.join(': ')) };
        }
    }
}
