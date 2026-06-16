import { apiClient } from './client'
import type { EventType } from '../types'

export const getEventTypes = async (): Promise<EventType[]> => {
  const response = await apiClient.get('/event-types')
  return response.data
}

export const getEventType = async (id: string): Promise<EventType> => {
  const response = await apiClient.get(`/event-types/${id}`)
  return response.data
}

export const createEventType = async (eventType: EventType): Promise<EventType> => {
  const response = await apiClient.post('/event-types', eventType)
  return response.data
}
