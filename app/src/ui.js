import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useI18n } from './i18n';

export const C = {
  ink: '#0B1B3A',      // gehra neela (navy)
  pine: '#1B3A6B',
  mint: '#E8EDF7',     // halka neela tint
  gold: '#C9A24B',
  bg: '#F4F6FA',
  card: '#FFFFFF',
  text: '#0E1A2F',
  mute: '#66748B',
  line: '#E3E8F0',
  red: '#C0362C',
  green: '#12805C',
};

export const fmt = (n, d = 2) => {
  const x = Number(n || 0);
  const [i, f] = Math.abs(x).toFixed(d).split('.');
  return (x < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + f : '');
};

export const dateStr = (s) => {
  const d = new Date(String(s).replace(' ', 'T'));
  return isNaN(d) ? s : d.toDateString().slice(4) + ' ' + d.toTimeString().slice(0, 5);
};

const LOGO = require('../assets/logo.png');

export function Logo({ size = 72, style }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size * 0.22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: size * 0.08 }, style]}>
      <Image source={LOGO} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
    </View>
  );
}

export function LangToggle({ light }) {
  const { lang, setLang } = useI18n();
  return (
    <TouchableOpacity
      onPress={() => setLang(lang === 'en' ? 'ur' : 'en')}
      style={{ paddingVertical: 7, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1,
        borderColor: light ? 'rgba(255,255,255,0.45)' : C.line,
        backgroundColor: light ? 'rgba(255,255,255,0.12)' : '#fff' }}
    >
      <Text style={{ color: light ? '#fff' : C.ink, fontWeight: '700', fontSize: 14 }}>{lang === 'en' ? 'اردو' : 'English'}</Text>
    </TouchableOpacity>
  );
}

export function Button({ title, onPress, loading, kind = 'primary', style, disabled }) {
  const bg = kind === 'primary' ? C.ink : kind === 'gold' ? C.gold : 'transparent';
  const col = kind === 'primary' ? '#fff' : C.ink;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
      style={[s.btn, { backgroundColor: bg, borderWidth: kind === 'ghost' ? 1.5 : 0, borderColor: C.ink, opacity: disabled ? 0.5 : 1 }, style]}
    >
      {loading ? <ActivityIndicator color={col} /> : <Text style={[s.btnT, { color: col }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function Field({ label, style, ...p }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput placeholderTextColor="#9AA6B8" style={s.input} {...p} />
    </View>
  );
}

export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;

export const Title = ({ children, style }) => <Text style={[s.title, style]}>{children}</Text>;

export function Msg({ error, ok }) {
  const { tr } = useI18n();
  if (error) return <Text style={s.err}>{tr(error)}</Text>;
  if (ok) return <Text style={s.ok}>{ok}</Text>;
  return null;
}

const s = StyleSheet.create({
  btn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  btnT: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 13, color: C.mute, marginBottom: 6, fontWeight: '600' },
  input: { height: 52, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 16, color: C.text },
  card: { backgroundColor: C.card, borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.line },
  title: { fontSize: 24, fontWeight: '800', color: C.ink, marginBottom: 12 },
  err: { color: C.red, marginBottom: 10, fontWeight: '600' },
  ok: { color: C.green, marginBottom: 10, fontWeight: '600' },
});
