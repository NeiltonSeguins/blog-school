import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { colors, spacing, fontSize } from '../../theme';
import { Post } from '../../types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any>;
}

export default function PostDetailScreen({ route, navigation }: Props) {
  const { id } = route.params || {};
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    try {
      const response = await api.get<Post>(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o post.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />;
  }

  if (!post) return null;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>Publicado por: {post.author}</Text>
        <Text style={styles.date}>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</Text>
      </View>

      <View style={styles.divider} />
      
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  backButton: {
    marginBottom: spacing.m,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: fontSize.m,
    fontWeight: 'bold',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.s,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  author: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
  date: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.m,
  },
  content: {
    fontSize: fontSize.l,
    lineHeight: 24,
    color: colors.text,
    paddingBottom: 40,
  }
});
