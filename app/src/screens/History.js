import React from 'react';
import { ScrollView, RefreshControl, Text } from 'react-native';
import { Card, Title, C } from '../ui';
import { TxRow } from './Home';
import { useI18n } from '../i18n';

export default function History({ history, refreshing, onRefresh }) {
  const { t } = useI18n();
  return (
    <ScrollView style={{ padding: 16, paddingTop: 58 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Title>{t('txHistory')}</Title>
      <Card>
        {history.length === 0 && <Text style={{ color: C.mute }}>{t('noTx')}</Text>}
        {history.map((x) => <TxRow key={x.id} tx={x} />)}
      </Card>
    </ScrollView>
  );
}
