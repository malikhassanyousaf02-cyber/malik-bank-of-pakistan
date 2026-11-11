import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { api, setToken } from '../api';
import { Button, Field, Msg, Logo, LangToggle, C } from '../ui';
import { useI18n } from '../i18n';

export default function Auth({ onDone }) {
  const { t } = useI18n();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ full_name: '', cnic: '', phone: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const submit = async () => {
    setErr('');
    if (mode === 'register' && f.password !== f.confirm) return setErr(t('pwMismatch'));
    setBusy(true);
    try {
      const r = await api(mode, mode === 'login'
        ? { cnic: f.cnic, password: f.password }
        : { full_name: f.full_name, cnic: f.cnic, phone: f.phone, password: f.password });
      await setToken(r.token);
      onDone();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.ink }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingTop: 54, paddingBottom: 38, paddingHorizontal: 26, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -60, top: -40, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(201,162,75,0.16)' }} />
          <View style={{ position: 'absolute', right: 40, top: 70, width: 130, height: 130, borderRadius: 65, borderWidth: 1, borderColor: 'rgba(201,162,75,0.35)' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 14 }}><LangToggle light /></View>
          <Logo size={84} />
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 18 }}>{t('appName')}</Text>
          <Text style={{ color: '#A9B8D6', fontSize: 15, marginTop: 4 }}>
            {mode === 'login' ? t('signInSub') : t('registerSub')}
          </Text>
        </View>

        <View style={{ flex: 1, backgroundColor: C.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}>
          {mode === 'register' && <Field label={t('fullName')} value={f.full_name} onChangeText={set('full_name')} />}
          <Field label={t('cnic')} value={f.cnic} onChangeText={set('cnic')} keyboardType="number-pad" maxLength={13} placeholder="3410112345671" />
          {mode === 'register' && <Field label={t('mobile')} value={f.phone} onChangeText={set('phone')} keyboardType="phone-pad" maxLength={11} placeholder="03001234567" />}
          <Field label={t('password')} value={f.password} onChangeText={set('password')} secureTextEntry placeholder={mode === 'register' ? t('passwordHint') : ''} />
          {mode === 'register' && <Field label={t('confirmPw')} value={f.confirm} onChangeText={set('confirm')} secureTextEntry />}

          <Msg error={err} />
          <Button title={mode === 'login' ? t('signIn') : t('createAccount')} onPress={submit} loading={busy} />

          <View style={{ height: 1, backgroundColor: C.line, marginVertical: 22 }} />
          <Text style={{ textAlign: 'center', color: C.mute, marginBottom: 10 }}>
            {mode === 'login' ? t('noAccount') : t('haveAccount')}
          </Text>
          <Button kind="ghost" title={mode === 'login' ? t('register') : t('signIn')} onPress={() => { setErr(''); setMode(mode === 'login' ? 'register' : 'login'); }} />

          {mode === 'register' && (
            <Text style={{ color: C.mute, fontSize: 12, marginTop: 16, textAlign: 'center' }}>{t('verifyNote')}</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
