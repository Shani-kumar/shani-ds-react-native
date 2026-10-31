import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Timeline, type TimelineStep } from '../Timeline';
import { ThemeProvider } from '../../../theme/ThemeProvider';

describe('Timeline Component (Group D)', () => {
  const mockSteps: TimelineStep[] = [
    {
      id: 'step-1',
      title: 'Order Dispatched',
      description: 'Package left Shenzhen sorting facility',
      timestamp: '08:30 AM',
      state: 'completed',
    },
    {
      id: 'step-2',
      title: 'Customs Clearance',
      description: 'Passed customs inspection at Port of LA',
      timestamp: '02:15 PM',
      state: 'current',
    },
    {
      id: 'step-3',
      title: 'Out for Delivery',
      description: 'Assigned to courier van #41',
      state: 'upcoming',
    },
    {
      id: 'step-4',
      title: 'Delivered',
      state: 'upcoming',
    },
  ];

  it('renders milestones with accessible list and item roles', () => {
    render(
      <ThemeProvider>
        <Timeline testID="shipment-timeline" steps={mockSteps} />
      </ThemeProvider>
    );

    const timeline = screen.getByTestId('shipment-timeline');
    expect(timeline.props.accessibilityRole).toBe('list');
    expect(timeline.props.accessibilityLabel).toBe('Shipment progress: 4 milestones');

    expect(screen.getByText('Order Dispatched')).toBeTruthy();
    expect(screen.getByText('08:30 AM')).toBeTruthy();
    expect(screen.getByText('Customs Clearance')).toBeTruthy();
    expect(screen.getByText('Out for Delivery')).toBeTruthy();
  });

  it('renders completed checkmark and current active focus dot', () => {
    render(
      <ThemeProvider>
        <Timeline testID="status-timeline" steps={mockSteps} />
      </ThemeProvider>
    );

    // Current step has active dot indicator
    expect(screen.getByTestId('status-timeline-step-1-current-dot')).toBeTruthy();

    // Connecting lines rendered between steps 0, 1, 2 (none on last step 3)
    expect(screen.getByTestId('status-timeline-step-0-line')).toBeTruthy();
    expect(screen.getByTestId('status-timeline-step-1-line')).toBeTruthy();
    expect(screen.getByTestId('status-timeline-step-2-line')).toBeTruthy();
    expect(screen.queryByTestId('status-timeline-step-3-line')).toBeNull();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<View>();
    render(
      <ThemeProvider>
        <Timeline ref={ref} testID="ref-timeline" steps={mockSteps} />
      </ThemeProvider>
    );

    expect(ref.current).toBeDefined();
  });
});

