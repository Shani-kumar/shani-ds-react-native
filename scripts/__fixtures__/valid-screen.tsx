import { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  IconButton,
  Icon,
  useTheme,
} from '@shani/ui';

export function ValidScreenFixture() {
  const { theme } = useTheme();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Box flex={1} bg="canvas">
      <ScrollView contentContainerStyle={{ padding: theme.spacing[4] }}>
        <VStack spacing="4">
          <Card variant="elevated" padding="md">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="heading" style={{ flexShrink: 1, minWidth: 0 }}>
                  #SHN-102938
                </Text>
                <IconButton
                  name="Printer"
                  accessibilityLabel="Print waybill label"
                  variant="ghost"
                  size="sm"
                />
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="2">
                <Badge variant="brand" dot={true}>
                  In Transit
                </Badge>
                <HStack spacing="1" align="center">
                  <Icon name="MapPin" size="xs" color="secondary" />
                  <Text variant="caption" color="secondary">
                    Chicago Central Hub
                  </Text>
                </HStack>
              </VStack>
            </CardContent>
            <CardFooter>
              <Button
                variant="primary"
                size="md"
                loading={submitting}
                leftIcon="CheckCircle"
                onPress={() => setSubmitting(true)}
              >
                Confirm Consignment
              </Button>
            </CardFooter>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
}
