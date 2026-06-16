import { useState, useRef, useMemo } from 'react'
import {
  Container,
  Title,
  Card,
  Text,
  Button,
  Stack,
  Grid,
  Modal,
  TextInput,
  Group,
  Badge,
  LoadingOverlay,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconRefresh } from '@tabler/icons-react'
import { useEventTypes } from '../hooks/useEventTypes'
import { useSlots, useCreateBooking } from '../hooks/useBookings'
import type { EventType, Slot } from '../types'
import dayjs from 'dayjs'
import { z } from 'zod'

function GuestPage() {
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [opened, { open, close }] = useDisclosure(false)

  const { data: eventTypes } = useEventTypes()

  const fromRef = useRef<string | undefined>(undefined)
  const toRef = useRef<string | undefined>(undefined)
  if (!fromRef.current) {
    fromRef.current = dayjs().startOf('day').toISOString()
  }
  if (!toRef.current) {
    toRef.current = dayjs().add(14, 'day').endOf('day').toISOString()
  }
  const from = fromRef.current
  const to = toRef.current

  const { data: slots, isLoading: slotsLoading, refetch } = useSlots(
    selectedEventType?.id || '',
    from,
    to
  )

  const createBooking = useCreateBooking()

  // Группировка слотов по датам
  const slotsByDate = useMemo(() => {
    const map: Record<string, Slot[]> = {}
    slots?.forEach((slot) => {
      const date = dayjs(slot.startTime).format('YYYY-MM-DD')
      if (!map[date]) map[date] = []
      map[date].push(slot)
    })
    return map
  }, [slots])

  const now = dayjs()

  // Даты с доступными слотами (зеленые)
  const availableDates = useMemo(() => {
    return Object.keys(slotsByDate).filter((date) =>
      slotsByDate[date].some((s) => s.isAvailable && dayjs(s.startTime).isAfter(now))
    )
  }, [slotsByDate])

  // Даты с полным бронированием (красные)
  const fullyBookedDates = useMemo(() => {
    return Object.keys(slotsByDate).filter((date) =>
      slotsByDate[date].every((s) => !s.isAvailable) &&
      slotsByDate[date].some((s) => dayjs(s.startTime).isAfter(now))
    )
  }, [slotsByDate])

  // Слоты на выбранную дату (только свободные и в будущем)
  const slotsForDate = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = dayjs(selectedDate).format('YYYY-MM-DD')
    return slotsByDate[dateStr]?.filter((s) => s.isAvailable && dayjs(s.startTime).isAfter(now)) || []
  }, [selectedDate, slotsByDate])

  const form = useForm({
    initialValues: {
      guestName: '',
      guestEmail: '',
    },
    validate: {
      guestName: (value) => (value.trim().length < 2 ? 'Name is too short' : null),
      guestEmail: (value) => {
        const emailSchema = z.string().email()
        try {
          emailSchema.parse(value)
          return null
        } catch {
          return 'Invalid email'
        }
      },
    },
  })

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    open()
  }

  const handleBooking = (values: { guestName: string; guestEmail: string }) => {
    if (!selectedEventType || !selectedSlot) return

    const booking = {
      id: crypto.randomUUID(),
      eventTypeId: selectedEventType.id,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      createdAt: dayjs().toISOString(),
    }

    createBooking.mutate(booking, {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'Your booking has been created!',
          color: 'green',
        })
        close()
        form.reset()
        setSelectedSlot(null)
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to create booking',
          color: 'red',
        })
      },
    })
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">Book an Appointment</Title>

      <Title order={3} mb="md">1. Select Event Type</Title>
      <Grid mb="xl">
        {eventTypes?.map((eventType) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={eventType.id}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                cursor: 'pointer',
                borderColor: selectedEventType?.id === eventType.id ? 'var(--mantine-color-blue-6)' : undefined,
              }}
              onClick={() => {
                setSelectedEventType(eventType)
                setSelectedDate(null)
                setSelectedSlot(null)
              }}
            >
              <Title order={4}>{eventType.title}</Title>
              <Text size="sm" c="dimmed" mb="xs">
                {eventType.description}
              </Text>
              <Badge>{eventType.duration} minutes</Badge>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {selectedEventType && (
        <>
          <Group justify="space-between" mb="md">
            <Title order={3}>2. Select Date</Title>
            <Button
              variant="light"
              size="sm"
              leftSection={<IconRefresh size="16" />}
              onClick={() => refetch()}
              loading={slotsLoading}
            >
              Refresh
            </Button>
          </Group>

          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <LoadingOverlay visible={slotsLoading} />
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              maxDate={dayjs().add(14, 'day').toDate()}
              getDayProps={(date) => {
                const dateStr = dayjs(date).format('YYYY-MM-DD')
                if (availableDates.includes(dateStr)) {
                  return {
                    style: {
                      backgroundColor: 'var(--mantine-color-green-1)',
                      color: 'var(--mantine-color-green-9)',
                      fontWeight: 700,
                    },
                  }
                }
                if (fullyBookedDates.includes(dateStr)) {
                  return {
                    style: {
                      backgroundColor: 'var(--mantine-color-red-1)',
                      color: 'var(--mantine-color-red-9)',
                    },
                  }
                }
                return { disabled: true }
              }}
            />
          </div>

          {selectedDate && (
            <>
              <Title order={3} mb="md">
                Available Slots on {dayjs(selectedDate).format('MMM D, YYYY')}
              </Title>
              <Stack mb="xl">
                {slotsForDate.length === 0 ? (
                  <Text c="dimmed" ta="center">
                    No available slots for this date
                  </Text>
                ) : (
                  slotsForDate.map((slot, index) => (
                    <Button
                      key={index}
                      variant="light"
                      color="blue"
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {dayjs(slot.startTime).format('HH:mm')} - {dayjs(slot.endTime).format('HH:mm')}
                    </Button>
                  ))
                )}
              </Stack>
            </>
          )}
        </>
      )}

      <Modal opened={opened} onClose={close} title="Confirm Booking">
        <form onSubmit={form.onSubmit(handleBooking)}>
          <Stack>
            <Text size="sm">
              Booking: {selectedEventType?.title} on{' '}
              {selectedSlot && dayjs(selectedSlot.startTime).format('MMM D, HH:mm')}
            </Text>
            <TextInput
              label="Your Name"
              placeholder="John Doe"
              {...form.getInputProps('guestName')}
              required
            />
            <TextInput
              label="Your Email"
              placeholder="john@example.com"
              {...form.getInputProps('guestEmail')}
              required
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>Cancel</Button>
              <Button type="submit" loading={createBooking.isPending}>
                Confirm Booking
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  )
}

export default GuestPage
