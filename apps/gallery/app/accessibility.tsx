import { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Icon,
  useTheme,
} from '@shani/ui';
import { GalleryHeader } from '../src/components/GalleryHeader';
import { getFullContrastReport, type ContrastReportItem } from '../src/utils/contrastAudit';

type FilterChip = 'All' | 'Light' | 'Dark' | 'Text' | 'Action' | 'Feedback' | 'UI';

export default function AccessibilityScreen() {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');

  const allReports = useMemo(() => {
    return getFullContrastReport();
  }, []);

  const filteredReports = useMemo(() => {
    return allReports.filter((item) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Light') return item.theme === 'light';
      if (activeFilter === 'Dark') return item.theme === 'dark';
      if (activeFilter === 'Text') return item.category === 'text';
      if (activeFilter === 'Action') return item.category === 'action';
      if (activeFilter === 'Feedback') return item.category === 'feedback';
      if (activeFilter === 'UI') return item.category === 'ui';
      return true;
    });
  }, [allReports, activeFilter]);

  const passedCount = useMemo(() => {
    return allReports.filter((r) => r.passed).length;
  }, [allReports]);

  const lightPassedCount = useMemo(() => {
    return allReports.filter((r) => r.theme === 'light' && r.passed).length;
  }, [allReports]);

  const darkPassedCount = useMemo(() => {
    return allReports.filter((r) => r.theme === 'dark' && r.passed).length;
  }, [allReports]);

  return (
    <Box flex={1} bg="canvas">
      <GalleryHeader title="Accessibility Audit" showBack={true} />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack spacing="6">
          {/* Executive Summary Card */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <VStack spacing="1" style={{ flex: 1, minWidth: 200, paddingRight: 8 }}>
                  <Text variant="title">WCAG 2.1 AA Compliance Audit</Text>
                  <Text variant="caption">
                    Automated color contrast verification covering all semantic color pairs in light and dark themes.
                  </Text>
                </VStack>
                <Badge variant="success" size="md">
                  {passedCount} of {allReports.length} pass AA
                </Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <HStack spacing="4" wrap={true}>
                <Card variant="outlined" padding="sm" style={{ flex: 1, minWidth: 140 }}>
                  <VStack spacing="1">
                    <Text variant="caption">Total Checks</Text>
                    <Text variant="title">{allReports.length} Pairs</Text>
                  </VStack>
                </Card>
                <Card variant="outlined" padding="sm" style={{ flex: 1, minWidth: 140 }}>
                  <VStack spacing="1">
                    <Text variant="caption">Light Theme Checks</Text>
                    <Text variant="title">{lightPassedCount} Passing</Text>
                  </VStack>
                </Card>
                <Card variant="outlined" padding="sm" style={{ flex: 1, minWidth: 140 }}>
                  <VStack spacing="1">
                    <Text variant="caption">Dark Theme Checks</Text>
                    <Text variant="title">{darkPassedCount} Passing</Text>
                  </VStack>
                </Card>
                <Card variant="outlined" padding="sm" style={{ flex: 1, minWidth: 140 }}>
                  <VStack spacing="1">
                    <Text variant="caption">Threshold Criteria</Text>
                    <Text variant="title">AA 4.5:1 / 3:1</Text>
                  </VStack>
                </Card>
              </HStack>
            </CardContent>
          </Card>

          {/* Filter Bar with Filter Chips and Summary */}
          <Card variant="outlined" padding="md">
            <VStack spacing="3">
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="label" style={{ fontWeight: '700' }}>Filter Checks:</Text>
                <Text variant="caption" color="secondary">
                  {passedCount} of {allReports.length} pass AA
                </Text>
              </HStack>
              <HStack spacing="2" align="center" wrap={true}>
                {(['All', 'Light', 'Dark', 'Text', 'Action', 'Feedback', 'UI'] as FilterChip[]).map(
                  (chip) => (
                    <Button
                      key={chip}
                      variant={activeFilter === chip ? 'primary' : 'ghost'}
                      size="sm"
                      onPress={() => setActiveFilter(chip)}
                    >
                      {chip}
                    </Button>
                  )
                )}
              </HStack>
            </VStack>
          </Card>

          {/* Contrast Pairs Report Table */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <HStack justify="between" align="center" wrap={true} spacing="2">
                <Text variant="title" style={{ flexShrink: 1, minWidth: 0 }}>
                  Contrast Audit Pairs ({filteredReports.length})
                </Text>
                <Badge variant="brand" size="sm" style={{ flexShrink: 0 }}>WCAG 2.1 AA</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack spacing="3">
                {filteredReports.map((item: ContrastReportItem, idx: number) => (
                  <Card key={`${item.theme}-${item.fgName}-${item.bgName}-${idx}`} variant="outlined" padding="md">
                    <VStack spacing="3" style={{ width: '100%' }}>
                      {/* 1. Top line: theme badge and category badge */}
                      <HStack justify="between" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
                        <HStack spacing="2" align="center" wrap={true}>
                          <Badge
                            variant={item.theme === 'light' ? 'brand' : 'neutral'}
                            size="sm"
                          >
                            {item.theme.toUpperCase()}
                          </Badge>
                          <Badge variant="neutral" size="sm">
                            {item.category.toUpperCase()}
                          </Badge>
                        </HStack>
                      </HStack>

                      {/* 2. Middle: pair name and on <background name> */}
                      <VStack spacing="0" style={{ width: '100%' }}>
                        <Text variant="label" style={{ fontWeight: '700', flexShrink: 1, minWidth: 0 }}>
                          {item.fgName}
                        </Text>
                        <Text variant="caption" color="secondary" style={{ flexShrink: 1, minWidth: 0 }}>
                          on <Text variant="caption" style={{ fontWeight: '600' }}>{item.bgName}</Text>
                        </Text>
                      </VStack>

                      {/* 3. Small live preview swatch with "Aa" + hex values in an aligned row */}
                      <HStack spacing="2" align="center" wrap={true} style={{ width: '100%' }}>
                        <View
                          style={{
                            width: 36,
                            height: 28,
                            backgroundColor: item.bgHex,
                            borderColor: theme.colors.border.subtle,
                            borderWidth: theme.borderWidth.hairline,
                            borderRadius: theme.radius.sm,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Text
                            variant="label"
                            style={{
                              color: item.fgHex,
                              fontWeight: '700',
                              lineHeight: 18,
                            }}
                          >
                            Aa
                          </Text>
                        </View>
                        <HStack spacing="1" align="center" wrap={true} style={{ flexShrink: 1, minWidth: 0 }}>
                          <Text
                            variant="caption"
                            style={{
                              fontFamily: 'monospace',
                              color: theme.colors.text.secondary,
                              fontSize: 11,
                            }}
                          >
                            {item.fgHex}
                          </Text>
                          <Text variant="caption" color="secondary" style={{ fontSize: 10 }}>
                            on
                          </Text>
                          <Text
                            variant="caption"
                            style={{
                              fontFamily: 'monospace',
                              color: theme.colors.text.secondary,
                              fontSize: 11,
                            }}
                          >
                            {item.bgHex}
                          </Text>
                        </HStack>
                      </HStack>

                      <Divider />

                      {/* 4. Right/bottom group: ratio pill, PASS/FAIL status, required threshold together in same position */}
                      <HStack justify="between" align="center" wrap={true} spacing="2" style={{ width: '100%' }}>
                        <HStack spacing="2" align="center">
                          <Badge variant={item.passed ? 'success' : 'danger'} size="sm">
                            {item.passed ? '✓ PASS' : '✗ FAIL'}
                          </Badge>
                          <Badge variant="neutral" size="sm">
                            {item.ratio}:1
                          </Badge>
                        </HStack>
                        <Text variant="caption" color="secondary" style={{ fontSize: 11, fontWeight: '500' }}>
                          Req: ≥{item.minRatio}:1
                        </Text>
                      </HStack>
                    </VStack>
                  </Card>
                ))}
              </VStack>
            </CardContent>
          </Card>

          {/* Architectural Accessibility Rules Card */}
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <Text variant="title">Design System Accessibility Standards</Text>
            </CardHeader>
            <CardContent>
              <VStack spacing="3">
                <HStack spacing="2" align="center">
                  <Icon name="CheckCircle" size="sm" color="success" />
                  <Text variant="body" style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '700' }}>WCAG 2.5.5 Target Size:</Text> All interactive buttons, checkboxes, switches, and icon buttons strictly enforce a 44x44pt minimum touch target for warehouse staff wearing industrial gloves.
                  </Text>
                </HStack>
                <HStack spacing="2" align="center">
                  <Icon name="CheckCircle" size="sm" color="success" />
                  <Text variant="body" style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '700' }}>WCAG 2.3.3 Reduced Motion:</Text> Reanimated spring micro-interactions (press scales, switch toggles, skeleton pulses) automatically check useReducedMotion() and fall back to static or instant transitions.
                  </Text>
                </HStack>
                <HStack spacing="2" align="center">
                  <Icon name="CheckCircle" size="sm" color="success" />
                  <Text variant="body" style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '700' }}>WCAG 1.4.4 Dynamic Type Scaling:</Text> All Text and Button components support font scaling up to 2.0x (maxFontSizeMultiplier={2.0}) to assist vision-impaired operators without layout breakage.
                  </Text>
                </HStack>
                <HStack spacing="2" align="center">
                  <Icon name="CheckCircle" size="sm" color="success" />
                  <Text variant="body" style={{ flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: '700' }}>Compile-Time Name Verification:</Text> IconButton mandates accessibilityLabel: string in TypeScript, making unlabeled icon buttons impossible to compile.
                  </Text>
                </HStack>
              </VStack>
            </CardContent>
          </Card>
        </VStack>
      </ScrollView>
    </Box>
  );
}
