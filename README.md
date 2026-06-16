# Calendar Booking Application

[![Actions Status](https://github.com/marataleyev/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/marataleyev/ai-for-developers-project-387/actions)

🚀 **Live Demo:** [https://ai-for-developers-project-386-l5nz.onrender.com/](https://ai-for-developers-project-386-l5nz.onrender.com/)

Приложение для бронирования слотов в календаре с двумя ролями: **владелец календаря** и **гости**.

## 📋 Описание

Владелец календаря создает типы событий (Consultation, Meeting, Workshop) с заданной длительностью. Гости выбирают тип события, дату из календаря и свободный слот для бронирования — без регистрации и авторизации.

### Основные правила

- На одно и то же время нельзя создать две записи, даже если это разные типы событий
- Гость может записаться только на свободный слот в окне 14 дней от текущей даты
- Владелец — один предопределенный профиль, без регистрации

## 🏗️ Архитектура

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   TypeSpec      │────▶│   OpenAPI 3.1   │────▶│  Prism (mock)  │
│  (Contract)     │     │  (openapi.yaml) │     │   (dev only)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React + Vite  │◀───│  Spring Boot    │◀───│  H2 Database    │
│   Mantine UI    │     │   REST API      │     │  (in-memory)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🛠️ Технологический стек

### Backend
- **Spring Boot 3.2.5** (Java 17)
- **Spring Data JPA** — работа с базой данных
- **H2 Database** — in-memory хранение
- **Lombok** — уменьшение boilerplate
- **JUnit 5 + Mockito** — тестирование

### Frontend
- **React 19 + TypeScript**
- **Vite** — сборка
- **Mantine UI** — компоненты, формы, календарь, уведомления
- **React Query (TanStack)** — кэширование, инвалидация данных
- **React Router** — навигация
- **Zod** — валидация email
- **Day.js** — работа с датами

### API Contract
- **TypeSpec** — описание API
- **OpenAPI 3.1.0** — сгенерированная спецификация
- **Prism** — мок-сервер для разработки

## 📁 Структура проекта

```
.
├── backend/                        # Spring Boot приложение
│   ├── src/main/java/com/calendar/booking/
│   │   ├── BookingApplication.java
│   │   ├── config/
│   │   │   └── CorsConfig.java        # CORS для frontend
│   │   ├── controller/
│   │   │   ├── EventTypeController.java
│   │   │   ├── CalendarController.java
│   │   │   └── BookingController.java
│   │   ├── dto/
│   │   │   └── SlotDTO.java           # Вычисляемый слот
│   │   ├── exception/
│   │   │   ├── SlotUnavailableException.java
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── model/
│   │   │   ├── EventType.java         # Entity
│   │   │   └── Booking.java           # Entity
│   │   ├── repository/
│   │   │   ├── EventTypeRepository.java
│   │   │   └── BookingRepository.java
│   │   └── service/
│   │       ├── EventTypeService.java
│   │       ├── CalendarService.java   # Генерация слотов
│   │       └── BookingService.java    # Логика бронирования
│   ├── src/main/resources/
│   │   ├── application.yml            # H2 in-memory config
│   │   └── data.sql                   # Тестовые данные
│   └── src/test/java/                 # Unit-тесты
│
├── frontend/                       # React приложение
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts              # HTTP-клиент (axios)
│   │   │   ├── eventTypes.ts
│   │   │   └── bookings.ts
│   │   ├── hooks/
│   │   │   ├── useEventTypes.ts      # React Query hooks
│   │   │   └── useBookings.ts
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # Выбор роли
│   │   │   ├── GuestPage.tsx         # Страница гостя
│   │   │   └── OwnerPage.tsx         # Страница владельца
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx                   # Роутинг и layout
│   │   └── main.tsx                  # Точка входа
│   └── .env                          # VITE_API_URL
│
├── main.tsp                        # TypeSpec спецификация
└── openapi.yaml                      # Сгенерированный OpenAPI
```

## 📡 API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/event-types` | Список типов событий |
| `GET` | `/event-types/{id}` | Получить тип по ID |
| `POST` | `/event-types` | Создать тип события |
| `GET` | `/calendar/slots` | Получить слоты (query: `eventTypeId`, `from`, `to`) |
| `GET` | `/bookings` | Все бронирования |
| `GET` | `/bookings/{id}` | Бронирование по ID |
| `POST` | `/bookings` | Создать бронирование |
| `DELETE` | `/bookings/{id}` | Удалить бронирование |

## 🎭 Функциональность

### Владелец календаря (`/admin`)

- Создание типов событий (название, описание, длительность в минутах)
- Просмотр всех типов событий
- Просмотр списка предстоящих бронирований
- Удаление бронирований

### Гость (`/guest`)

- Просмотр списка типов событий
- Выбор типа события
- Календарь с подсветкой дат:
  - 🟢 Зеленый — есть свободные слоты
  - 🔴 Красный — все слоты заняты
  - ⚪ Серый — нет доступных слотов
- Ограничение календаря: 14 дней от текущей даты
- Список свободных слотов на выбранную дату (только будущие)
- Бронирование с указанием имени и email
- Валидация email через Zod
- Toast-уведомления об успехе/ошибке

### Бизнес-логика

- **Шаг слота** = длительность выбранного типа события
- **Уникальность** — проверка по `startTime` (constraint на уровне API)
- **Окно 14 дней** — валидация при создании бронирования
- **Фильтрация по времени** — не отображаются слоты, которые уже прошли

## 🚀 Запуск

### Требования
- Java 17+
- Node.js 18+
- Maven

### Backend

```bash
cd backend
mvn spring-boot:run
```

API доступен на `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение доступно на `http://localhost:5173`

### Полный стек (для разработки)

```bash
# Terminal 1 — Backend
cd backend && mvn spring-boot:run

# Terminal 2 — Frontend
cd frontend && npm run dev
```

## 🧪 Тесты

### Backend

```bash
cd backend
mvn test
```

**7 тестов** — все проходят:
- `CalendarServiceTest` — генерация слотов, проверка доступности
- `BookingServiceTest` — создание, ошибка duplicate, удаление
- `BookingControllerTest` — `200 OK`, `409 CONFLICT`

### Frontend

```bash
cd frontend
npm run build
```

## 📝 API Contract

Спецификация описана в TypeSpec (`main.tsp`) и генерируется в OpenAPI 3.1.0 (`openapi.yaml`):

```bash
# Генерация OpenAPI
npx tsp compile .
```

### Модели

**EventType**
```typescript
{
  id: string
  title: string
  duration: number   // минуты
  description: string
}
```

**Slot** (вычисляемый)
```typescript
{
  startTime: string  // ISO 8601
  endTime: string
  isAvailable: boolean
}
```

**Booking**
```typescript
{
  id: string
  eventTypeId: string
  startTime: string  // ISO 8601
  endTime: string
  guestName: string
  guestEmail: string
  createdAt: string
}
```

## 🌐 CORS

Frontend (`http://localhost:5173`) может обращаться к backend (`http://localhost:8080`) благодаря настроенному CORS:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "DELETE", "OPTIONS", "PUT")
                .allowedHeaders("*");
    }
}
```

## 📦 Тестовые данные

При старте backend автоматически создаются 3 типа событий:

| ID | Название | Длительность |
|----|----------|-------------|
| `meeting-30` | Quick Meeting | 30 мин |
| `consultation-60` | Consultation | 60 мин |
| `workshop-120` | Workshop | 120 мин |

## 📄 Лицензия

MIT
