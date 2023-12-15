/*этот сеанс на стороне сервера нашего пользователя */

import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const Member = async () => {
  const session = await getServerSession(options); // проверяем существует сеанс вообще

  /*если не будет сеанса*/
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Member");
  }
  return (
    <div>
      <h4>Member Server Session </h4>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
};

export default Member;
