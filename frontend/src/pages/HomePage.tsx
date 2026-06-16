import { Container, Title, Text, Button, Stack } from '@mantine/core'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="md">
        <Title>Welcome to Calendar Booking</Title>
        <Text size="lg" c="dimmed" ta="center">
          Book appointments easily. Choose your role below to get started.
        </Text>
        <Button component={Link} to="/guest" size="lg">
          I am a Guest
        </Button>
        <Button component={Link} to="/admin" variant="outline" size="lg">
          I am the Owner
        </Button>
      </Stack>
    </Container>
  )
}

export default HomePage
