import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Card, Title, Button, Logo, C, dateStr } from '../ui';
import { useI18n } from '../i18n';

const Row = ({ k, v, color, rtl }) => (
  <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
    <Text style={{ color: C.mute }}>{k}</Text>
    <Text style={{ color: color || C.text, fontWeight: '700', maxWidth: '62%' }}>{v}</Text>
  </View>
);

export default function Profile({ me, onLogout }) {
  const { t, lang, setLang, isRTL } = useI18n();
  const u = me.user;
  const masked = u.cnic.slice(0, 5) + '-' + '*******' + '-' + u.cnic.slice(-1);

  const Seg = ({ code, label }) => (
    <TouchableOpacity onPress={() => setLang(code)}
      style={{ flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12, backgroundColor: lang === code ? C.ink : 'transparent' }}>
      <Text style={{ color: lang === code ? '#fff' : C.ink, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ padding: 16, paddingTop: 58 }}>
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Logo size={92} style={{ borderWidth: 1, borderColor: C.line }} />
        <Text style={{ color: C.ink, fontSize: 20, fontWeight: '800', marginTop: 12 }}>{t('appName')}</Text>
      </View>

      <Card>
        <Row rtl={isRTL} k={t('name')} v={u.full_name} />
        <Row rtl={isRTL} k={t('cnicLabel')} v={masked} />
        <Row rtl={isRTL} k={t('mobileLabel')} v={u.phone} />
        <Row rtl={isRTL} k={t('accountNo')} v={u.account_no} />
        <Row rtl={isRTL} k={t('cnicVerification')} v={u.verified ? t('verified') : t('pendingShort')} color={u.verified ? C.green : '#B07A00'} />
        <Row rtl={isRTL} k={t('memberSince')} v={dateStr(u.member_since)} />
      </Card>

      <Card>
        <Text style={{ fontWeight: '800', color: C.ink, marginBottom: 6 }}>{t('accounts')}</Text>
        {me.accounts.map((a) => <Row rtl={isRTL} key={a.currency} k={a.currency} v={Number(a.balance).toFixed(2)} />)}
      </Card>

      <Card>
        <Text style={{ fontWeight: '800', color: C.ink, marginBottom: 10 }}>{t('language')}</Text>
        <View style={{ flexDirection: 'row', backgroundColor: C.mint, borderRadius: 14, padding: 4 }}>
          <Seg code="en" label="English" />
          <Seg code="ur" label="اردو" />
        </View>
      </Card>

      <Button kind="ghost" title={t('signOut')} onPress={onLogout} />
      <Text style={{ color: C.mute, fontSize: 11, textAlign: 'center', marginTop: 24, marginBottom: 90 }}>
        {t('appName')} - {t('footer')}
      </Text>
    </ScrollView>
  );
}
