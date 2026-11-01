import { ScrollView, Pressable, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Box, VStack, HStack, Text, Badge, useTheme } from '@shani/ui';

interface NavItem {
  title: string;
  path: string;
  badge?: string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'Foundations',
    items: [
      { title: 'Overview', path: '/' },
      { title: 'Design Tokens', path: '/tokens', badge: 'Core' },
      { title: 'Box & Stack', path: '/components/box-stack' },
      { title: 'Text', path: '/components/text' },
      { title: 'Icon', path: '/components/icon' },
    ],
  },
  {
    groupTitle: 'Components',
    items: [
      { title: 'Button', path: '/components/button' },
      { title: 'IconButton', path: '/components/icon-button' },
      { title: 'TextField', path: '/components/text-field' },
      { title: 'Checkbox', path: '/components/checkbox' },
      { title: 'Switch', path: '/components/switch' },
      { title: 'Card', path: '/components/card' },
      { title: 'Badge', path: '/components/badge' },
      { title: 'Skeleton', path: '/components/skeleton' },
      { title: 'Timeline', path: '/components/timeline' },
    ],
  },
  {
    groupTitle: 'Demos',
    items: [
      { title: 'Shipment Tracking', path: '/demos/tracking', badge: 'Live' },
      { title: 'Shipments Fleet List', path: '/demos/shipments', badge: 'Live' },
    ],
  },
  {
    groupTitle: 'Accessibility',
    items: [
      { title: 'Contrast Audit & A11y', path: '/accessibility', badge: 'WCAG AA' },
    ],
  },
];

export function DocsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <Box
      bg="surface"
      borderColor="subtle"
      borderWidth="hairline"
      style={{
        width: 260,
        height: '100%',
        borderRightWidth: theme.borderWidth.thin,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
      }}
    >
      <ScrollView contentContainerStyle={{ padding: theme.spacing[4], paddingBottom: theme.spacing[8] }}>
        <VStack spacing="5">
          {NAV_GROUPS.map((group) => (
            <VStack key={group.groupTitle} spacing="2">
              <Text
                variant="caption"
                color="secondary"
                style={{
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  paddingHorizontal: theme.spacing[2],
                }}
              >
                {group.groupTitle}
              </Text>

              <VStack spacing="1">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <Pressable
                      key={item.path}
                      onPress={() => router.push(item.path as never)}
                      style={({ pressed }) => [
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: theme.spacing[2],
                          paddingHorizontal: theme.spacing[3],
                          borderRadius: theme.radius.md,
                          backgroundColor: isActive
                            ? theme.colors.bg.brandSubtle
                            : pressed
                            ? theme.colors.bg.surfaceRaised
                            : 'transparent',
                        },
                      ]}
                    >
                      <HStack spacing="2" align="center" style={{ flexShrink: 1, minWidth: 0 }}>
                        {isActive ? (
                          <View
                            style={{
                              width: 3,
                              height: 14,
                              borderRadius: theme.radius.full,
                              backgroundColor: theme.colors.text.brand,
                            }}
                          />
                        ) : null}
                        <Text
                          variant="body"
                          style={{
                            fontWeight: isActive ? '600' : '400',
                            color: isActive ? theme.colors.text.brandEmphasized : theme.colors.text.primary,
                            fontSize: 14,
                          }}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                      </HStack>

                      {item.badge ? (
                        <Badge
                          variant={isActive ? 'brand' : 'neutral'}
                          size="sm"
                          style={{ flexShrink: 0 }}
                        >
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Pressable>
                  );
                })}
              </VStack>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
