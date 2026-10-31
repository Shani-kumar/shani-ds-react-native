import { forwardRef } from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../Text/Text';

export type TimelineStepState = 'completed' | 'current' | 'upcoming';

export interface TimelineStep {
  /** Unique key for the step */
  id: string;
  /** Primary label/title of the tracking milestone */
  title: string;
  /** Detailed note or address description */
  description?: string;
  /** Timestamp or estimated arrival time */
  timestamp?: string;
  /** Current state of this milestone */
  state: TimelineStepState;
}

export interface TimelineProps {
  /** Array of tracking milestone steps */
  steps: TimelineStep[];
  /** Test identifier */
  testID?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Timeline renders an accessible vertical progress stepper for tracking shipments and logistics runs.
 * Features state-driven indicators (completed check, active focus dot, upcoming hollow dot)
 * and token-based connecting lines.
 */
export const Timeline = forwardRef<View, TimelineProps>(function Timeline(
  { steps, testID, style },
  ref
) {
  const { theme } = useTheme();
  const timelineTokens = theme.components.timeline;

  return (
    <View
      ref={ref}
      testID={testID}
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel={`Shipment progress: ${steps.length} milestones`}
      style={[{ width: '100%' }, style]}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompleted = step.state === 'completed';
        const isCurrent = step.state === 'current';

        // Indicator dot styling
        const indicatorSize = timelineTokens.indicator.size;
        let indicatorContent: React.ReactNode = null;
        let indicatorBg = timelineTokens.dot.upcoming.bg;
        let indicatorBorder = timelineTokens.dot.upcoming.border;

        if (isCompleted) {
          indicatorBg = timelineTokens.dot.completed.bg;
          indicatorBorder = timelineTokens.dot.completed.bg;
          indicatorContent = (
            <Check size={14} color={timelineTokens.dot.completed.icon} strokeWidth={3} />
          );
        } else if (isCurrent) {
          indicatorBg = timelineTokens.dot.current.bg;
          indicatorBorder = timelineTokens.dot.current.border;
          indicatorContent = (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: theme.radius.full,
                backgroundColor: timelineTokens.dot.current.center,
              }}
              testID={testID ? `${testID}-step-${index}-current-dot` : undefined}
            />
          );
        }

        const indicatorContainerStyle: ViewStyle = {
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: theme.radius.full,
          backgroundColor: indicatorBg,
          borderWidth: timelineTokens.indicator.borderWidth,
          borderColor: indicatorBorder,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        };

        // Connecting vertical line styling
        const lineColor = isCompleted
          ? timelineTokens.line.color.completed
          : timelineTokens.line.color.upcoming;

        const lineStyle: ViewStyle = {
          position: 'absolute',
          top: indicatorSize,
          left: (indicatorSize - timelineTokens.line.width) / 2,
          bottom: 0,
          width: timelineTokens.line.width,
          backgroundColor: lineColor,
        };

        const itemA11yLabel = `Step ${index + 1} of ${steps.length}: ${step.state}, ${step.title}${step.timestamp ? `, ${step.timestamp}` : ''}${step.description ? `, ${step.description}` : ''}`;

        return (
          <View
            key={step.id}
            testID={testID ? `${testID}-step-${index}` : undefined}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={itemA11yLabel}
            style={{
              flexDirection: 'row',
              position: 'relative',
              paddingBottom: isLast ? 0 : theme.spacing[5],
            }}
          >
            {/* Indicator Column with connecting line */}
            <View
              style={{ alignItems: 'center', width: indicatorSize, marginRight: theme.spacing[3] }}
            >
              <View style={indicatorContainerStyle}>{indicatorContent}</View>
              {!isLast && (
                <View
                  style={lineStyle}
                  testID={testID ? `${testID}-step-${index}-line` : undefined}
                />
              )}
            </View>

            {/* Content Column */}
            <View style={{ flex: 1, paddingTop: 2 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Text
                  variant={isCurrent ? 'title' : 'body'}
                  weight={isCurrent ? 'bold' : isCompleted ? 'semibold' : 'regular'}
                  color={isCompleted || isCurrent ? 'primary' : 'secondary'}
                >
                  {step.title}
                </Text>
                {step.timestamp ? (
                  <Text variant="caption" color="secondary">
                    {step.timestamp}
                  </Text>
                ) : null}
              </View>

              {step.description ? (
                <View style={{ marginTop: theme.spacing[1] }}>
                  <Text variant="caption" color={isCurrent ? 'primary' : 'secondary'}>
                    {step.description}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
});
