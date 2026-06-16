import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEventTypes, createEventType } from '../api/eventTypes'

export const useEventTypes = () => {
  return useQuery({
    queryKey: ['eventTypes'],
    queryFn: getEventTypes,
  })
}

export const useCreateEventType = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createEventType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] })
    },
  })
}
