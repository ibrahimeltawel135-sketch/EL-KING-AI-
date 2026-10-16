import { forwardRef, Children, type ReactNode } from 'react';
import { Alert as NativeAlert, Text as NativeText, TextInput as NativeTextInput, type TextInputProps, type TextProps } from 'react-native';
import { getCurrentLocale, translate, useLocale } from '../lib/locale';

function localizeChildren(children: ReactNode, locale: 'ar' | 'en'): ReactNode {
  return Children.map(children, (child) => typeof child === 'string' ? translate(child, locale) : child);
}

/** React Native text with locale-aware strings and bidi direction. */
type LocalizedTextProps = TextProps & { readonly translateText?: boolean };
export const Text = forwardRef<NativeText, LocalizedTextProps>(function AppText({ children, style, translateText = false, ...props }, ref) {
  const { locale } = useLocale();
  return (
    <NativeText
      ref={ref}
      {...props}
      style={[{ writingDirection: locale === 'ar' ? 'rtl' : 'ltr', textAlign: locale === 'ar' ? 'right' : 'left' }, style]}
    >
      {translateText ? localizeChildren(children, locale) : children}
    </NativeText>
  );
});

/** Text fields translate only fixed labels explicitly marked by their caller. */
type LocalizedTextInputProps = TextInputProps & {
  readonly translatePlaceholder?: boolean;
  readonly translateAccessibilityLabel?: boolean;
};
export type TextInput = NativeTextInput;
export const TextInput = forwardRef<NativeTextInput, LocalizedTextInputProps>(function AppTextInput(
  { placeholder, accessibilityLabel, autoCapitalize, style, translatePlaceholder = false, translateAccessibilityLabel = false, ...props },
  ref
) {
  const { locale } = useLocale();
  const fieldLocale = autoCapitalize === 'none' ? 'en' : locale;
  return (
    <NativeTextInput
      ref={ref}
      {...props}
      autoCapitalize={autoCapitalize}
      placeholder={placeholder === undefined || !translatePlaceholder ? placeholder : translate(placeholder, locale)}
      accessibilityLabel={accessibilityLabel === undefined || !translateAccessibilityLabel ? accessibilityLabel : translate(accessibilityLabel, locale)}
      style={[{ writingDirection: fieldLocale === 'ar' ? 'rtl' : 'ltr', textAlign: fieldLocale === 'ar' ? 'right' : 'left' }, style]}
    />
  );
});

/** Alert copy follows the same active locale as the visible React Native UI. */
export function showLocalizedAlert(...args: Parameters<typeof NativeAlert.alert>): void {
  const [title, message, buttons, options] = args;
  const locale = getCurrentLocale();
  NativeAlert.alert(
    translate(title, locale),
    message === undefined ? undefined : translate(message, locale),
    buttons?.map((button) => ({ ...button, ...(button.text === undefined ? {} : { text: translate(button.text, locale) }) })),
    options
  );
}

export function showAlertWithRawMessage(title: string, message: string): void {
  const locale = getCurrentLocale();
  NativeAlert.alert(translate(title, locale), message);
}

export const Alert = { alert: showLocalizedAlert, alertWithRawMessage: showAlertWithRawMessage };
