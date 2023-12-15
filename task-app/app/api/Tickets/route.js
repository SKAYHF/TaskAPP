/* папка API необходима для того, чтобы наше приложение имело доступ к нашей базе данных */

import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";

/* создаем маршурт для получения созданных билетов*/
export async function GET() {
  try {
    const tickets = await Ticket.find();

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

/* определяем функцию для создания билетов */
export async function POST(req) {
  // Для передачи запросов. Post это то как мы создаём билеты
  /*(try) Для создания билета мы получим запрос, в котором будут указаны данные для билета. По сути, мы создадим форму, которая позволит пользователю добавлять данные, и они прикрепят их к запросу, а затем мы передадим это билету. */
  try {
    const body = await req.json(); // ожидаем то что было по запросу.Посути извлекаем данные из body
    const ticketData = body.formData;

    await Ticket.create(ticketData);

    return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
