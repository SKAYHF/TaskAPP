import React from "react";
import TicketCard from "./(components)/TicketCard";

const getTickets = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/Tickets", {
      // ответ равняется ожиданию
      cache: "no-store", // не хотим хранить данные
    });
    //если есть,
    if (!res.ok) {
      throw new Error("Failed to fetch topics");
    }

    return res.json();
  } catch (error) {
    // а если нет
    console.log("Error loading topics: ", error);
  }
};

// Компонент для отображения списка билетов
const Dashboard = async () => {
  const data = await getTickets();

  /* 
 Проверяем, есть ли данные о билетах в объекте 'data'. 
 Если таких данных нет, то возвращаем компонент <p>No tickets.</p>.
 */
  if (!data?.tickets) {
    return <p>Oops! It seems there are no tickets at the moment.</p>;
  }

  // Извлекаем массив билетов из данных
  const tickets = data.tickets;

  // Находим уникальные категории билетов для фильтрации
  const uniqueCategories = [
    ...new Set(tickets?.map(({ category }) => category)),
  ];

  return (
    <div className="p-5">
      {/* этим разделом мы указываем есть ли у нас билеты  */}
      <div>
        {/* если есть билеты мы их заносим в категорию */}
        {tickets &&
          uniqueCategories?.map((uniqueCategory, categoryIndex) => (
            <div key={categoryIndex} className="mb-4">
              <h2>{uniqueCategory}</h2>{" "}
              {/* это даёт придставление какой категории мы относимся в данный момент */}
              <div className="lg:grid grid-cols-2 xl:grid-cols-4 ">
                {" "}
                {/* для корректного отображения на маленьком и большом экране */}
                {tickets
                  .filter((ticket) => ticket.category === uniqueCategory)
                  .map((filteredTicket, _index) => (
                    <TicketCard
                      id={_index}
                      key={_index}
                      ticket={filteredTicket}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;

{
  /*  key={categoryIndex}, таким образом, каждый раз, когда мы выполняем сопоставление, нам нужно присвоить ему уникальный ключ. Поэтому мы передаем (categoryIndex). */
}

{
  /* 
  tickets.filter((ticket) => ticket.category === uniqueCategory);
  Проверяем соответствует ли категория (tickets.filter), для которой мы хотим получить уникальные элементы, в отличие от уникальных категорий в единственном числе. То есть если текущий билет(tickets.filter((ticket)) соответствует заголовку категории  (<h2>{uniqueCategory}</h2>), то мы хотим, чтобы он отображался (ticket.category === uniqueCategory) так что если это так, то мы отфильтровывая по категориям (.map((filteredTicket,  _index)) если он соответствует нашей текущей категории. После этого мы передаем <TicketCard/>. 



  Фильтруем билеты по категории, чтобы отобразить только те, которые соответствуют текущей уникальной категории.
  То есть, если текущий билет соответствует категории, показанной в заголовке (<h2>{uniqueCategory}</h2>),
  мы хотим, чтобы он был отображен (ticket.category === uniqueCategory). Далее, отфильтровываем билеты по категории (.map((filteredTicket,  _index))), и если они соответствуют текущей категории, мы передаем их компоненту <TicketCard/>.

*/
}
