import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing, fontSize } from '../theme';
import { Post } from '../types';
import { formatDate } from '../utils/date';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

export default function PostCard({ post, onPress, onEdit, onDelete, canEdit }: PostCardProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>

        <View style={styles.content}>
          <View style={styles.header}>
            {post.category && <Text style={styles.category}>{post.category}</Text>}
            <View style={styles.datesContainer}>
              {post.updatedAt ? (
                <Text style={styles.date}>Atualizado: {formatDate(post.updatedAt)}</Text>
              ) : (
                <Text style={styles.date}>Criado: {formatDate(post.createdAt)}</Text>
              )}
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>

          <Text style={styles.description} numberOfLines={2}>
            {post.description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.authorContainer}>
              <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${String(post.author)}&background=random` }}
                style={styles.authorAvatar}
              />
              <Text style={styles.author}>{String(post.author)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {canEdit && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editAction}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteAction}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },

  content: {
    padding: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: fontSize.s,
    color: colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  datesContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 10,
    color: colors.textLight,
  },
  title: {
    fontSize: fontSize.l,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  description: {
    fontSize: fontSize.m,
    color: colors.textLight,
    marginBottom: spacing.m,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  author: {
    fontSize: fontSize.s,
    color: colors.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.m,
    paddingTop: 0,
    gap: spacing.m,
  },
  editAction: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  deleteAction: {
    color: colors.error,
    fontWeight: 'bold',
  }
});
