import { Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from './AppText';
import type { StyleProp, TextStyle } from 'react-native';

import { splitBold } from '../lib/chatMarkdown';

/** An assistant reply, with the emphasis rendered rather than spelled out. */
export function ChatText({ children, style }: { readonly children: string; readonly style?: StyleProp<TextStyle> }) {
  return (
    <Text style={style} translateText={false}>
      {splitBold(children).map((run, index) => (
        <Fragment key={index}>{run.bold ? <Text style={styles.bold} translateText={false}>{run.text}</Text> : run.text}</Fragment>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' }
});
