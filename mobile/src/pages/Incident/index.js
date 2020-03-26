import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api';
import Styles from './styles';
import logo from '../../assets/logo.png';

export default function Incident() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchIncidents() {
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);

    const response = await api.get('incidents', {
      params: {
        page
      }
    });

    setIncidents([...incidents, ...response.data]);
    setTotal(response.headers['x-total-count']);
    setPage(page + 1);
    setLoading(false);
  }

  useEffect(() => {
    fetchIncidents();
  }, []);

  function navigateToDetails(incident) {
    navigation.navigate('Details', { incident });
  }
  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <Image source={logo} />
        <Text style={Styles.headerText}>
          Total de <Text style={Styles.headerTextBold}>{total} casos</Text>
        </Text>
      </View>

      <Text style={Styles.title}>Bem-vindo!</Text>
      <Text style={Styles.description}>
        Escolha um dos casos abaixo e salve o dia.
      </Text>

      <FlatList
        style={Styles.incidentList}
        data={incidents}
        onEndReached={fetchIncidents}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={Styles.incident}>
            <Text style={Styles.incidentProperty}>ONG:</Text>
            <Text style={Styles.incidentValue}>{item.name}</Text>

            <Text style={Styles.incidentProperty}>CASO:</Text>
            <Text style={Styles.incidentValue}>{item.title}</Text>

            <Text style={Styles.incidentProperty}>VALOR:</Text>
            <Text style={Styles.incidentValue}>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(item.value)}
            </Text>

            <TouchableOpacity
              onPress={() => navigateToDetails(item)}
              style={Styles.detailsButton}
            >
              <Text style={Styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name='arrow-right' size={16} color='#e02041' />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
