import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { api, loadToken, setToken, setUnauthorizedHandler } from './src/api';
import { C, Logo } from './src/ui';
import { LangProvider, useI18n } from './src/i18n';
import Auth from './src/screens/Auth';
import Home from './src/screens/Home';
import History from './src/screens/History';
import Transfer from './src/screens/Transfer';
import Bills from './src/screens/Bills';
import Exchange from './src/screens/Exchange';
import Insurance from './src/screens/Insurance';
import Profile from './src/screens/Profile';

const TABS = [
  ['home', 'home'],
  ['history', 'time'],
  ['exchange', 'swap-horizontal'],
  ['insurance', 'shield-checkmark'],
  ['profile', 'person'],
];

function Main() {
  const { t } = useI18n();
  const [boot, setBoot] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [me, setMe] = useState(null);
  const [history, setHistory] = useState([]);
  const [screen, setScreen] = useState('home');
  const [refreshing, setRefreshing] = useState(false);

  const logout = useCallback(async () => {
    await setToken(null); setMe(null); setHistory([]); setScreen('home'); setAuthed(false);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [m, h] = await Promise.all([api('me'), api('history?limit=50')]);
      setMe(m); setHistory(h.transactions);
    } catch (e) {}
  }, []);

  const pull = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };

  useEffect(() => {
    setUnauthorizedHandler(logout);
    (async () => {
      const tk = await loadToken();
      if (tk) { setAuthed(true); await refresh(); }
      setTimeout(() => setBoot(false), 1000);
    })();
  }, []);

  const onLogin = async () => { setAuthed(true); await refresh(); };

  if (boot) {
    return (
      <View style={{ flex: 1, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="light" />
        <Logo size={110} />
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 20 }}>{t('appName')}</Text>
      </View>
    );
  }

  if (!authed) return (<><StatusBar style="light" /><Auth onDone={onLogin} /></>);

  if (!me) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={C.ink} /></View>;
  }

  const inTab = TABS.some((x) => x[0] === screen);
  const back = () => setScreen('home');

  let body;
  if (screen === 'home') body = <Home me={me} history={history} refreshing={refreshing} onRefresh={pull} go={setScreen} />;
  else if (screen === 'history') body = <History history={history} refreshing={refreshing} onRefresh={pull} />;
  else if (screen === 'exchange') body = <Exchange me={me} onDone={refresh} />;
  else if (screen === 'insurance') body = <Insurance onDone={refresh} />;
  else if (screen === 'profile') body = <Profile me={me} onLogout={logout} />;
  else if (screen === 'transfer') body = <Transfer onBack={back} onDone={refresh} />;
  else if (screen === 'bills') body = <Bills onBack={back} onDone={refresh} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{body}</View>
      <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 60, paddingTop: 0 }}>
        {TABS.map(([key, icon]) => {
          const on = screen === key || (!inTab && key === 'home');
          return (
            <TouchableOpacity key={key} onPress={() => setScreen(key)} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ width: 26, height: 3, borderRadius: 2, backgroundColor: on ? C.gold : 'transparent', marginBottom: 8 }} />
              <Ionicons name={icon} size={22} color={on ? C.ink : '#9AA6B8'} />
              <Text style={{ fontSize: 11, marginTop: 2, color: on ? C.ink : '#9AA6B8', fontWeight: on ? '800' : '500' }}>{t('tab_' + key)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (<LangProvider><Main /></LangProvider>);
}
