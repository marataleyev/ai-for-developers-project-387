import "@typespec/http";

using Http;

@service(#{
  title: "Calendar Booking Service",
})
namespace CalendarBookingService;

/** Тип события */
model EventType {
  /** Идентификатор типа события */
  id: string;

  /** Название типа события */
  title: string;

  /** Длительность в минутах */
  duration: int32;

  /** Описание типа события */
  description: string;
}

/** Слот для бронирования (вычисляемый) */
model Slot {
  /** Время начала слота */
  startTime: utcDateTime;

  /** Время окончания слота */
  endTime: utcDateTime;

  /** Доступен ли слот для бронирования */
  isAvailable: boolean;
}

/** Бронирование */
model Booking {
  /** Идентификатор бронирования */
  id: string;

  /** Идентификатор типа события */
  eventTypeId: string;

  /** Время начала бронирования */
  startTime: utcDateTime;

  /** Время окончания бронирования */
  endTime: utcDateTime;

  /** Имя гостя */
  guestName: string;

  /** Email гостя */
  guestEmail: string;

  /** Дата и время создания бронирования */
  createdAt: utcDateTime;
}

@route("/event-types")
@tag("EventTypes")
interface EventTypes {
  /** Получение всех типов событий */
  @get list(): EventType[];

  /** Получение конкретного типа события */
  @get read(@path id: string): EventType;

  /** Создание типа события */
  @post create(@body eventType: EventType): EventType;
}

@route("/calendar")
@tag("Calendar")
interface Calendar {
  /** Получение доступных слотов для бронирования */
  @get
  @route("/slots")
  listSlots(
    @query eventTypeId: string,
    @query from: utcDateTime,
    @query to: utcDateTime,
  ): Slot[];
}

@route("/bookings")
@tag("Bookings")
interface Bookings {
  /** Создание бронирования */
  @post create(@body booking: Booking): Booking;

  /** Получение конкретного бронирования */
  @get read(@path id: string): Booking;

  /** Отмена бронирования (физическое удаление) */
  @delete delete(@path id: string): void;
}
