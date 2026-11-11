import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Logo, LangToggle, C, fmt, dateStr } from '../ui';
import { useI18n, txLabel } from '../i18n';

export const TxRow = ({ tx }) => {
  const { t, isRTL } = useI18n();
  const plus = Number(tx.amount) > 0;
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: plus ? '#E3F4EC' : '#FBE9E7', alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 }}>
        <Ionicons name={plus ? 'arrow-down' : 'arrow-up'} size={18} color={plus ? C.green : C.red} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.text, fontWeight: '600' }} numberOfLines={2}>{txLabel(tx, t)}</Text>
        <Text style={{ color: C.mute, fontSize: 12, marginTop: 2 }}>{dateStr(tx.created_at)}</Text>
      </View>
      <Text style={{ color: plus ? C.green : C.red, fontWeight: '700' }}>
        {plus ? '+' : '-'}{tx.currency} {fmt(Math.abs(tx.amount))}
      </Text>
    </View>
  );
};

export default function Home({ me, history, refreshing, onRefresh, go }) {
  const { t, isRTL } = useI18n();
  const pkr = me.accounts.find((a) => a.currency === 'PKR');
  const others = me.accounts.filter((a) => a.currency !== 'PKR' && Number(a.balance) > 0);
  const actions = [
    ['paper-plane', t('send'), () => go('transfer')],
    ['receipt', t('bills'), () => go('bills')],
    ['swap-horizontal', t('tab_exchange'), () => go('exchange')],
    ['shield-checkmark', t('tab_insurance'), () => go('insurance')],
  ];
  const rowDir = isRTL ? 'row-reverse' : 'row';

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: rowDir, alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: C.mute }}>{t('welcome')}</Text>
          <Text style={{ color: C.ink, fontSize: 22, fontWeight: '800' }}>{me.user.full_name}</Text>
        </View>
        <LangToggle />
      </View>

      {/* Bank card */}
      <View style={{ margin: 16, borderRadius: 26, backgroundColor: C.ink, padding: 22, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(201,162,75,0.20)' }} />
        <View style={{ position: 'absolute', right: 40, top: 70, width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: 'rgba(201,162,75,0.40)' }} />
        <View style={{ position: 'absolute', left: -50, bottom: -70, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.05)' }} />

        <View style={{ flexDirection: rowDir, alignItems: 'center' }}>
          <Logo size={38} />
          <Text style={{ color: '#fff', fontWeight: '700', marginHorizontal: 10 }}>{t('appName')}</Text>
        </View>

        <Text style={{ color: '#A9B8D6', marginTop: 26 }}>{t('available')}</Text>
        <Text style={{ color: '#fff', fontSize: 38, fontWeight: '800', marginTop: 2 }}>
          <Text style={{ fontSize: 20, color: C.gold }}>Rs. </Text>{fmt(pkr ? pkr.balance : 0)}
        </Text>

        <View style={{ flexDirection: rowDir, justifyContent: 'space-between', marginTop: 24 }}>
          <Text style={{ color: '#D7DFEE', letterSpacing: 1.5 }}>{me.user.account_no}</Text>
          <Text style={{ color: C.gold, fontWeight: '700' }}>PKR</Text>
        </View>

        {others.length > 0 && (
          <View style={{ flexDirection: rowDir, flexWrap: 'wrap', marginTop: 14 }}>
            {others.map((a) => (
              <View key={a.currency} style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12, marginHorizontal: 4, marginBottom: 6 }}>
                <Text style={{ color: C.gold, fontWeight: '700' }}>{a.currency} {fmt(a.balance)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: rowDir, justifyContent: 'space-between', marginBottom: 18 }}>
          {actions.map(([icon, label, fn]) => (
            <TouchableOpacity key={label} onPress={fn} style={{ alignItems: 'center', width: '23%' }}>
              <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={icon} size={26} color={C.ink} />
              </View>
              <Text style={{ marginTop: 6, color: C.text, fontWeight: '600', fontSize: 12 }} numberOfLines={1}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!me.user.verified && (
          <Card style={{ backgroundColor: '#FFF7E3', borderColor: '#F0DEAA' }}>
            <Text style={{ color: '#7A5A00', fontWeight: '700' }}>{t('pending')}</Text>
            <Text style={{ color: '#7A5A00', marginTop: 2, fontSize: 13 }}>{t('pendingSub')}</Text>
          </Card>
        )}

        <Card>
          <Text style={{ fontSize: 17, fontWeight: '800', color: C.ink }}>{t('recent')}</Text>
          {history.length === 0 && <Text style={{ color: C.mute, paddingVertical: 14 }}>{t('noTx')}</Text>}
          {history.slice(0, 5).map((x) => <TxRow key={x.id} tx={x} />)}
          {history.length > 5 && (
            <TouchableOpacity onPress={() => go('history')} style={{ paddingTop: 12 }}>
              <Text style={{ color: C.pine, fontWeight: '700', textAlign: 'center' }}>{t('seeAll')}</Text>
            </TouchableOpacity>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}
