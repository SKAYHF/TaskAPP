/* папка API необходима для того, чтобы наше приложение имело доступ к нашей базе данных */

import Ticket from "@/app/models/Ticket";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  const foundTicket = await Ticket.findOne({ _id: id });
  return NextResponse.json({ foundTicket }, { status: 200 });
}

export async function PUT(req, { params }) {
  /*(try) Для создания билета мы получим запрос, в котором будут указаны данные для билета. По сути, мы создадим форму, которая позволит пользователю добавлять данные, и они прикрепят их к запросу, а затем мы передадим это билету. */
  try {
    const { id } = params;

    const body = await req.json(); // ожидаем то что было по запросу.Посути извлекаем данные из body
    const ticketData = body.formData;

    const updateTicketData = await Ticket.findByIdAndUpdate(id, {
      ...ticketData,
    });

    return NextResponse.json({ message: "Ticket updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await Ticket.findByIdAndDelete(id);
    return NextResponse.json({ message: "Ticket Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
