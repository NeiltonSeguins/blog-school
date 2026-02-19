import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { usersService } from '../../services/usersService';
import { categoriesService } from '../../services/categoriesService';
import { formatDate } from '../../utils/date';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user } = useAuth();
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
      const postData = response.data;

      // Resolve Author Name if teacherId exists AND user is a teacher (to avoid 403)
      if (postData.teacherId && user?.role === 'teacher') {
        try {
          // We could fetch all teachers or just the one. 
          // Since we don't have getTeacherById exposed yet or we can use getTeachers and find.
          // Let's assume we can fetch all for now or add getTeacherById.
          // Actually, usersService.getTeachers() returns all.

          // Try/Catch specifically for this call as students might get 403
          const teachers = await usersService.getTeachers();
          const teacher = teachers.find(t => t.id === postData.teacherId);
          if (teacher) {
            postData.author = teacher.name;
          }
        } catch (error) {
          console.log("Failed to resolve teacher name", error);
        }
      }

      // Resolve Category Name if categoryId exists
      if (postData.categoryId) {
        try {
          // Fetch all categories to ensure we get the mapped name (label -> name)
          const categories = await categoriesService.getAll();
          const category = categories.find(c => c.id === postData.categoryId);
          if (category) {
            postData.category = category.name;
          }
        } catch (error) {
          console.log("Failed to resolve category name", error);
        }
      }

      setPost(postData);
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
