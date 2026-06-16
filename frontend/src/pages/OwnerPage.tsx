import { useState } from 'react'
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
  Textarea,
  NumberInput,
  Group,
  Table,
  LoadingOverlay,
  Badge,
  ActionIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { useEventTypes, useCreateEventType } from '../hooks/useEventTypes'
import { useBookings, useDeleteBooking } from '../hooks/useBookings'
import type { EventType } from '../types'
import dayjs from 'dayjs'

function OwnerPage() {
  const [opened, { open, close }] = useDisclosure(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)

  const { data: eventTypes, isLoading: typesLoading } = useEventTypes()
  const { data: bookings, isLoading: bookingsLoading } = useBookings()
  const createEventType = useCreateEventType()
  const deleteBooking = useDeleteBooking()

  const form = useForm({
    initialValues: {
      id: '',
      title: '',
      description: '',
      duration: 30,
    },
    validate: {
      title: (value) => (value.trim().length < 2 ? 'Title is too short' : null),
      description: (value) => (value.trim().length < 5 ? 'Description is too short' : null),
      duration: (value) => (value < 5 ? 'Duration must be at least 5 minutes' : null),
    },
  })

  const handleCreateEventType = (values: typeof form.values) => {
    const eventType: EventType = {
      id: values.id || crypto.randomUUID(),
      title: values.title,
      description: values.description,
      duration: values.duration,
    }

    createEventType.mutate(eventType, {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'Event type created successfully!',
          color: 'green',
        })
        close()
        form.reset()
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to create event type',
          color: 'red',
        })
      },
    })
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    openDelete()
  }

  const confirmDelete = () => {
    if (!deleteId) return

    deleteBooking.mutate(deleteId, {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'Booking deleted successfully',
          color: 'green',
        })
        closeDelete()
        setDeleteId(null)
      },
      onError: (error: any) => {
        notifications.show({
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to delete booking',
          color: 'red',
        })
      },
    })
  }

  const getEventTypeTitle = (eventTypeId: string) => {
    return eventTypes?.find((et) => et.id === eventTypeId)?.title || eventTypeId
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Owner Dashboard</Title>
        <Button onClick={open}>Create Event Type</Button>
      </Group>

      <Title order={3} mb="md">Event Types</Title>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={typesLoading} />
        <Grid mb="xl">
          {eventTypes?.map((eventType) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={eventType.id}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4}>{eventType.title}</Title>
                <Text size="sm" c="dimmed" mb="xs">
                  {eventType.description}
                </Text>
                <Badge>{eventType.duration} minutes</Badge>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>

      <Title order={3} mb="md">Upcoming Bookings</Title>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={bookingsLoading} />
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Event Type</Table.Th>
              <Table.Th>Date & Time</Table.Th>
              <Table.Th>Guest</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <Table.Tr key={booking.id}>
                  <Table.Td>{getEventTypeTitle(booking.eventTypeId)}</Table.Td>
                  <Table.Td>
                    {dayjs(booking.startTime).format('MMM D, HH:mm')}
                  </Table.Td>
                  <Table.Td>{booking.guestName}</Table.Td>
                  <Table.Td>{booking.guestEmail}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <IconTrash size="16" />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} ta="center">
                  <Text c="dimmed">No bookings found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      <Modal opened={opened} onClose={close} title="Create Event Type">
        <form onSubmit={form.onSubmit(handleCreateEventType)}>
          <Stack>
            <TextInput
              label="ID (optional)"
              placeholder="Leave empty for auto-generated"
              {...form.getInputProps('id')}
            />
            <TextInput
              label="Title"
              placeholder="Meeting"
              {...form.getInputProps('title')}
              required
            />
            <Textarea
              label="Description"
              placeholder="Describe this event type"
              {...form.getInputProps('description')}
              required
            />
            <NumberInput
              label="Duration (minutes)"
              placeholder="30"
              min={5}
              {...form.getInputProps('duration')}
              required
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>Cancel</Button>
              <Button type="submit" loading={createEventType.isPending}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Confirm Deletion">
        <Stack>
          <Text>Are you sure you want to delete this booking?</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete}>Cancel</Button>
            <Button color="red" onClick={confirmDelete} loading={deleteBooking.isPending}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}

export default OwnerPage
