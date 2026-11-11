import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View, Alert, RefreshControl } from 'react-native';
import { api } from '../api';
import { Button, Msg, Title, Card, C, fmt, dateStr } from '../ui';
import { useI18n, planName } from '../i18n';

export default function Insurance({ onDone }) {
  const { t, isRTL } = useI18n();
  const [data, setData] = useState({ plans: [], mine: [] });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(0);
  const rowDir = isRTL ? 'row-reverse' : 'row';

  const load = useCallback(async () => { try { setData(await api('insurance')); } catch (e) { setErr(e.message); } }, []);
  useEffect(() => { load(); }, [load]);

  const join = (p) => {
    Alert.alert(t('joinTitle'), `${planName(p.name, t)}\n${t('premium')}: Rs. ${fmt(p.premium, 0)}`, [
      { text: t('cancel'), style: 'cancel' },
      { text: t('payJoin'), onPress: async () => {
        setErr(''); setOk(''); setBusy(p.id);
        try { await api('insurance', { plan_id: p.id }); setOk(t('joinOk', { name: planName(p.name, t) })); await load(); onDone(); }
        catch (e) { setErr(e.message); }
        setBusy(0);
      } },
    ]);
  };
  const joined = (id) => data.mine.some((m) => Number(m.plan_id) === Number(id) && m.status === 'active');
  const desc = (p) => { const d = t('plan_' + p.id); return d.indexOf('plan_') === 0 ? p.description : d; };

  return (
    <ScrollView style={{ padding: 16, paddingTop: 58 }} refreshControl={<RefreshControl refreshing={false} onRefresh={load} />}>
      <Title>{t('insuranceTitle')}</Title>
      <Text style={{ color: C.mute, marginBottom: 12 }}>{t('insuranceSub')}</Text>
      <Msg error={err} ok={ok} />

      {data.plans.map((p) => (
        <Card key={p.id}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>{planName(p.name, t)}</Text>
          <Text style={{ color: C.mute, marginTop: 2 }}>{desc(p)}</Text>
          <View style={{ flexDirection: rowDir, justifyContent: 'space-between', marginTop: 12, marginBottom: 12 }}>
            <View><Text style={{ color: C.mute, fontSize: 12 }}>{t('premium')}</Text><Text style={{ fontWeight: '800', color: C.ink }}>Rs. {fmt(p.premium, 0)}</Text></View>
            <View><Text style={{ color: C.mute, fontSize: 12 }}>{t('cover')}</Text><Text style={{ fontWeight: '800', color: C.green }}>Rs. {fmt(p.coverage, 0)}</Text></View>
          </View>
          <Button title={joined(p.id) ? t('joined') : t('join')} kind={joined(p.id) ? 'ghost' : 'gold'}
            disabled={joined(p.id)} loading={busy === p.id} onPress={() => join(p)} />
        </Card>
      ))}

      {data.mine.length > 0 && (
        <Card>
          <Text style={{ fontSize: 17, fontWeight: '800', color: C.ink, marginBottom: 6 }}>{t('myInsurance')}</Text>
          {data.mine.map((m) => (
            <View key={m.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <Text style={{ fontWeight: '700', color: C.text }}>{planName(m.name, t)}</Text>
              <Text style={{ color: C.mute, fontSize: 12 }}>{t('paid')} Rs. {fmt(m.premium_paid, 0)} - {dateStr(m.joined_at)}</Text>
            </View>
          ))}
        </Card>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
