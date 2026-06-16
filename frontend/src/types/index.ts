export interface EventType {
  id: string
  title: string
  duration: number
  description: string
}

export interface Slot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Booking {
  id: string
  eventTypeId: string
  startTime: string
  endTime: string
  guestName: string
  guestEmail: string
  createdAt: string
}
