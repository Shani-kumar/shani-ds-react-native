import { forwardRef, useState, useId } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Platform,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';
import { useTextField } from '../../primitives/useTextField';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';

export type TextFieldSize = 'sm' | 'md' | 'lg';

export interface TextFieldProps extends Omit<
  TextInputProps,
  'value' | 'defaultValue' | 'onChangeText' | 'editable'
> {
  /** Form field label */
  label?: string;
  /** Helper hint text displayed below the field */
  helperText?: string;
  /** Error state or explicit error message */
  error?: boolean | string;
  /** Prefix element or icon rendered before input */
  prefix?: React.ReactNode;
  /** Suffix element or icon rendered after input */
  suffix?: React.ReactNode;
  /** Whether the field is for sensitive input */
  secureTextEntry?: boolean;
  /** Whether to show a toggle eye button for secure text entry (default: false) */
  showSecureToggle?: boolean;
  /** Size tier enforcing minimum 44pt touch targets (default: 'md') */
  size?: TextFieldSize;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Controlled input value */
  value?: string;
  /** Default uncontrolled input value */
  defaultValue?: string;
  /** Transient placeholder hint text */
  placeholder?: string;
  /** Color for placeholder text */
  placeholderTextColor?: string;
  /** Callback triggered on text change */
  onChangeText?: (text: string) => void;
  /** Custom style for the field container (including label and helper) */
  containerStyle?: StyleProp<ViewStyle>;
  /** Custom style for the input box */
  inputStyle?: StyleProp<TextStyle>;
  /** Test identifier */
  testID?: string;
}

/**
 * TextField is the standard form input primitive in Shani DS.
 * Built on `useTextField` headless hook. Enforces token-based styling,
 * 44pt minimum touch target, clear visual focus/error states, and accessible error association.
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  {
    label,
    helperText,
    error,
    prefix,
    suffix,
    secureTextEntry = false,
    showSecureToggle = false,
    size = 'md',
    disabled = false,
    readOnly = false,
    required = false,
    value,
    defaultValue,
    onChangeText,
    placeholder,
    containerStyle,
    inputStyle,
    testID,
    accessibilityLabel,
    accessibilityHint,
    ...rest
  },
  ref
) {
  const { theme } = useTheme();
  const generatedId = useId();
  const fieldId = testID ?? `textfield-${generatedId}`;

  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const { state, inputProps } = useTextField({
    value,
    defaultValue,
    onChangeText,
    disabled,
    readOnly,
    required,
    error,
    accessibilityLabel: accessibilityLabel ?? label,
    accessibilityHint,
    testID: fieldId,
  });

  const inputTokens = theme.components.input;
  const sizeTokens = inputTokens.size[size];

  // Resolve border color & width based on state
  let borderColor: string = inputTokens.border.default;
  let borderWidth = theme.borderWidth.thin;

  if (state.isDisabled) {
    borderColor = inputTokens.border.disabled;
  } else if (state.hasError) {
    borderColor = inputTokens.border.error;
    borderWidth = theme.borderWidth.medium;
  } else if (state.isFocused) {
    borderColor = inputTokens.border.focus;
    borderWidth = theme.borderWidth.medium;
  }

  // Resolve background color
  const backgroundColor = state.isDisabled ? inputTokens.bgDisabled : inputTokens.bg;

  // Resolve text color
  const textColor = state.isDisabled ? inputTokens.text.disabled : inputTokens.text.value;

  const boxStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizeTokens.minHeight,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    borderRadius: theme.radius.md,
    borderWidth,
    borderColor,
    backgroundColor,
    gap: sizeTokens.gap,
    width: '100%',
    maxWidth: '100%',
  };

  const nativeInputStyle: TextStyle = {
    flex: 1,
    minWidth: 0,
    height: '100%',
    fontFamily: theme.typography.fontFamily.sans,
    fontSize: sizeTokens.fontSize,
    color: textColor,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none' as never,
      outlineWidth: 0 as never,
    }),
  };

  const effectiveSecure = secureTextEntry && !isSecureVisible;

  return (
    <View style={[{ width: '100%' }, containerStyle]}>
      {label ? (
        <View
          style={{ marginBottom: theme.spacing[1], flexDirection: 'row', alignItems: 'center' }}
        >
          <Text variant="label" color={state.isDisabled ? 'muted' : 'primary'}>
            {label}
            {required ? (
              <Text variant="label" color="danger">
                {' *'}
              </Text>
            ) : null}
          </Text>
        </View>
      ) : null}

      <View style={boxStyle}>
        {prefix ? <View testID={`${fieldId}-prefix`} style={{ flexShrink: 0 }}>{prefix}</View> : null}

        <TextInput
          ref={ref}
          {...inputProps}
          placeholder={placeholder}
          placeholderTextColor={inputTokens.text.placeholder}
          secureTextEntry={effectiveSecure}
          maxFontSizeMultiplier={2.0}
          allowFontScaling={true}
          style={[nativeInputStyle, inputStyle]}
          {...rest}
        />

        {showSecureToggle && secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSecureVisible ? 'Hide text' : 'Show text'}
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            testID={`${fieldId}-secure-toggle`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ flexShrink: 0 }}
          >
            <Icon
              icon={isSecureVisible ? EyeOff : Eye}
              size={sizeTokens.iconSize}
              color={state.isDisabled ? 'muted' : 'secondary'}
            />
          </Pressable>
        ) : null}

        {suffix ? <View testID={`${fieldId}-suffix`} style={{ flexShrink: 0 }}>{suffix}</View> : null}
      </View>

      {state.hasError && state.errorMessage ? (
        <View style={{ marginTop: theme.spacing[1] }}>
          <Text variant="caption" color="danger" testID={`${fieldId}-error`}>
            {state.errorMessage}
          </Text>
        </View>
      ) : helperText ? (
        <View style={{ marginTop: theme.spacing[1] }}>
          <Text variant="caption" color="secondary" testID={`${fieldId}-helper`}>
            {helperText}
          </Text>
        </View>
      ) : null}
    </View>
  );
});
