import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import type { Reservation, ReservationCreateInfo } from './types/Reservation.ts';
import type { ResultSetHeader } from 'mysql2/promise';

const msqlc = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'pwd',
    database: 'reservations13e'
});

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    async createReservation(info: ReservationCreateInfo) {
        const [inserted] = await msqlc.execute<ResultSetHeader>('INSERT INTO reservations(name, email, startDate, guests) VALUES (?,?,?,?)', [info.name, info.email, info.startDate, info.guests])
        return { id: inserted.insertId, ...info } satisfies Reservation;
    }
}
