import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCalendarEvent, IconUser, IconHome } from '@tabler/icons-react'
import GuestPage from './pages/GuestPage'
import OwnerPage from './pages/OwnerPage'
import HomePage from './pages/HomePage'

function App() {
  const [opened, { toggle }] = useDisclosure()

  return (
    <BrowserRouter>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Calendar Booking</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavLink component={Link} to="/" label="Home" leftSection={<IconHome size="16" />} />
          <NavLink component={Link} to="/guest" label="Guest View" leftSection={<IconCalendarEvent size="16" />} />
          <NavLink component={Link} to="/admin" label="Owner View" leftSection={<IconUser size="16" />} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/guest" element={<GuestPage />} />
            <Route path="/admin" element={<OwnerPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
