import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { api } from '../api';
import { Button, Field, Msg, Title, Card, C, fmt } from '../ui';
import { useI18n } from '../i18n';

export default function Transfer({ onBack, onDone }) {
  const { t } = useI18n();
  const [f, setF] = useState({ phone: '', amount: '', note: '' });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const send = async () => {
    setErr(''); setOk(''); setBusy(true);
    try {
      await api('transfer', f);
      setOk(t('sentOk', { amount: fmt(f.amount) }));
      setF({ phone: '', amount: '', note: '' }); onDone();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <ScrollView style={{ padding: 16, paddingTop: 58 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={onBack}><Text style={{ color: C.pine, fontWeight: '700', marginBottom: 10 }}>‹ {t('back')}</Text></TouchableOpacity>
      <Title>{t('sendMoney')}</Title>
      <Card>
        <Field label={t('receiverMobile')} value={f.phone} onChangeText={set('phone')} keyboardType="phone-pad" maxLength={11} placeholder="03001234567" />
        <Field label={t('amountPkr')} value={f.amount} onChangeText={set('amount')} keyboardType="decimal-pad" placeholder="0.00" />
        <Field label={t('noteOpt')} value={f.note} onChangeText={set('note')} maxLength={100} />
        <Msg error={err} ok={ok} />
        <Button title={t('send')} onPress={send} loading={busy} />
      </Card>
    </ScrollView>
  );
}
