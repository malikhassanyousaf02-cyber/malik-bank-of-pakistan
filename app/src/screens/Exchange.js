import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, FlatList, TextInput, RefreshControl } from 'react-native';
import { api } from '../api';
import { Button, Field, Msg, Title, Card, C, fmt } from '../ui';
import { useI18n } from '../i18n';

function Picker({ visible, list, onPick, onClose }) {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const data = list.filter((c) => c.includes(q.toUpperCase()));
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: C.bg, padding: 16, paddingTop: 58 }}>
        <Title>{t('chooseCurrency')}</Title>
        <TextInput value={q} onChangeText={setQ} placeholder={t('search')} autoCapitalize="characters"
          style={{ height: 50, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', paddingHorizontal: 14, marginBottom: 10 }} />
        <FlatList data={data} keyExtractor={(i) => i} keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setQ(''); onPick(item); }} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink }}>{item}</Text>
            </TouchableOpacity>
          )} />
        <Button kind="ghost" title={t('close')} onPress={() => { setQ(''); onClose(); }} style={{ marginTop: 10, marginBottom: 20 }} />
      </View>
    </Modal>
  );
}

function Sel({ label, value, bal, onPress }) {
  const { t } = useI18n();
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 14 }}>
      <Text style={{ color: C.mute, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: C.ink, fontSize: 26, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: C.mute, fontSize: 12 }}>{t('balance')} {fmt(bal)}</Text>
    </TouchableOpacity>
  );
}

export default function Exchange({ me, onDone }) {
  const { t, isRTL } = useI18n();
  const [fx, setFx] = useState(null);
  const [from, setFrom] = useState('PKR');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState('');
  const [pick, setPick] = useState(null);
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  const load = async () => { try { setFx(await api('rates')); } catch (e) { setErr(e.message); } };
  useEffect(() => { load(); }, []);

  const list = useMemo(() => (fx ? Object.keys(fx.rates).sort() : []), [fx]);
  const bal = (cur) => Number((me.accounts.find((a) => a.currency === cur) || {}).balance || 0);

  const mid = fx && fx.rates[from] && fx.rates[to] ? fx.rates[to] / fx.rates[from] : 0;
  const rate = mid * (1 - (fx ? fx.spread : 0));
  const got = Number(amount) > 0 ? Number(amount) * rate : 0;

  const swap = () => { setFrom(to); setTo(from); };

  const doExchange = async () => {
    setErr(''); setOk(''); setBusy(true);
    try {
      await api('exchange', { from, to, amount });
      setOk(t('exchangeOk')); setAmount(''); onDone();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <ScrollView style={{ padding: 16, paddingTop: 58 }} keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}>
      <Title>{t('currencyExchange')}</Title>

      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: 14 }}>
        <Sel label={t('youGive')} value={from} bal={bal(from)} onPress={() => setPick('from')} />
        <TouchableOpacity onPress={swap} style={{ padding: 10 }}><Text style={{ fontSize: 22, color: C.ink }}>⇄</Text></TouchableOpacity>
        <Sel label={t('youGet')} value={to} bal={bal(to)} onPress={() => setPick('to')} />
      </View>

      <Card>
        <Field label={t('amountIn', { cur: from })} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" />
        {fx && mid > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: C.mute }}>{t('marketRate')}: 1 {from} = {mid.toFixed(4)} {to}</Text>
            <Text style={{ color: C.ink, fontWeight: '700', marginTop: 2 }}>{t('ourRate')}: 1 {from} = {rate.toFixed(4)} {to}</Text>
            <Text style={{ color: C.ink, fontSize: 20, fontWeight: '800', marginTop: 10 }}>{t('youWillReceive')}: {fmt(got)} {to}</Text>
          </View>
        )}
        <Msg error={err} ok={ok} />
        <Button title={t('doExchange')} onPress={doExchange} loading={busy} disabled={!fx || !(Number(amount) > 0)} />
        {fx && <Text style={{ color: C.mute, fontSize: 11, marginTop: 10 }}>{fx.source === 'live' ? t('ratesLive') : t('ratesApprox')}</Text>}
      </Card>

      <Picker visible={!!pick} list={list} onClose={() => setPick(null)}
        onPick={(c) => { if (pick === 'from') setFrom(c); else setTo(c); setPick(null); }} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
