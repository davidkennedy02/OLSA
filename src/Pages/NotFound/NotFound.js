import { Container, Title, Text, Group } from '@mantine/core';
import { MantineProvider } from '@mantine/core';
import { Illustration } from './Illustration.tsx';
import classes from './NotFound.module.css';

export default function NotFound() {
  return (
    <MantineProvider>
        <Container className={classes.root}>
            <div className={classes.inner}>
                <Illustration className={classes.image} />
                <div className={classes.content}>
                <Title className={classes.title}>Nothing to see here</Title>
                <div>
                    <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                        The page you are trying to open does not exist.
                    </Text>
                </div>
                </div>
            </div>
        </Container>
    </MantineProvider>
  );
}

