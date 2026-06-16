import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSlots, createBooking, getBookings, getBooking, deleteBooking } from '../api/bookings'

export const useSlots = (eventTypeId: string, from: string, to: string) => {
  return useQuery({
    queryKey: ['slots', eventTypeId, from, to],
    queryFn: () => getSlots(eventTypeId, from, to),
    enabled: !!eventTypeId && !!from && !!to,
  })
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  })
}

export const useDeleteBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
