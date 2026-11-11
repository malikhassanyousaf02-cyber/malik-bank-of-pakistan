import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../api';
import { Button, Field, Msg, Title, Card, C } from '../ui';
import { useI18n } from '../i18n';

const COMPANIES = ['Electricity', 'Gas', 'Water', 'Internet', 'Mobile Load', 'Education'];

export default function Bills({ onBack, onDone }) {
  const { t, isRTL } = useI18n();
  const [company, setCompany] = useState('Electricity');
  const [f, setF] = useState({ consumer_no: '', amount: '' });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  const pay = async () => {
    setErr(''); setOk(''); setBusy(true);
    try {
      await api('bills', { company, ...f });
      setOk(t('billOk')); setF({ consumer_no: '', amount: '' }); onDone();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <ScrollView style={{ padding: 16, paddingTop: 58 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={onBack}><Text style={{ color: C.pine, fontWeight: '700', marginBottom: 10 }}>‹ {t('back')}</Text></TouchableOpacity>
      <Title>{t('billPayment')}</Title>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', marginBottom: 6 }}>
        {COMPANIES.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCompany(c)}
            style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginHorizontal: 4, marginBottom: 8, backgroundColor: company === c ? C.ink : C.mint }}>
            <Text style={{ color: company === c ? '#fff' : C.ink, fontWeight: '700' }}>{t('co_' + c)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Card>
        <Field label={t('consumerNo')} value={f.consumer_no} onChangeText={(v) => setF({ ...f, consumer_no: v })} maxLength={20} />
        <Field label={t('amountPkr')} value={f.amount} onChangeText={(v) => setF({ ...f, amount: v })} keyboardType="decimal-pad" />
        <Msg error={err} ok={ok} />
        <Button title={t('payBill')} onPress={pay} loading={busy} />
      </Card>
    </ScrollView>
  );
}
