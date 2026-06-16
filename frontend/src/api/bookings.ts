import { apiClient } from './client'
import type { Booking, Slot } from '../types'

export const getSlots = async (
  eventTypeId: string,
  from: string,
  to: string
): Promise<Slot[]> => {
  const response = await apiClient.get('/calendar/slots', {
    params: { eventTypeId, from, to },
  })
  return response.data
}

export const createBooking = async (booking: Booking): Promise<Booking> => {
  const response = await apiClient.post('/bookings', booking)
  return response.data
}

export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get('/bookings')
  return response.data
}

export const getBooking = async (id: string): Promise<Booking> => {
  const response = await apiClient.get(`/bookings/${id}`)
  return response.data
}

export const deleteBooking = async (id: string): Promise<void> => {
  await apiClient.delete(`/bookings/${id}`)
}
