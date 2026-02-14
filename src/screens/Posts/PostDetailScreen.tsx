import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { formatDate } from '../../utils/date';
import { colors, spacing, fontSize } from '../../theme';
import { Post } from '../../types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

interface Props {
  route: RouteProp<any, any>;
  navigation: StackNavigationProp<any>;
}

const { width } = Dimensions.get('window');

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!post) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color={colors.primary} iconStyle="solid" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>

          {/* Category Pill */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{post.category || 'Geral'}</Text>
            </View>
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{post.title}</Text>

          {/* Author Info */}
          <View style={styles.authorContainer}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${post.author}&background=random` }}
              style={styles.authorAvatar}
            />
            <View>
              <Text style={styles.authorLabel}>Publicado por</Text>
              <Text style={styles.authorName}>{post.author}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Content */}
          <Text style={styles.content}>{post.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  imageContainer: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: spacing.l,
    backgroundColor: '#FFF',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  categoryPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: fontSize.s,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
  title: {
    fontSize: 24, // Explicit size for title
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.l,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.m,
    backgroundColor: colors.border,
  },
  authorLabel: {
    fontSize: fontSize.s,
    color: colors.textLight,
  },
  authorName: {
    fontSize: fontSize.m,
    fontWeight: 'bold',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: spacing.l,
  },
  content: {
    fontSize: fontSize.l,
    lineHeight: 28, // Better readability
    color: colors.text,
    paddingBottom: 40,
  }
});
