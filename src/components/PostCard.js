import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../theme';

export default function PostCard({ post, onPress, onEdit, onDelete, canEdit }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.author}>Por: {post.author}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {post.description}
        </Text>
      </TouchableOpacity>
      
      {canEdit && (
        <View style={styles.actions}>
           <TouchableOpacity onPress={onEdit} style={[styles.actionButton, { backgroundColor: colors.secondary }]}>
             <Text style={styles.actionText}>Editar</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={onDelete} style={[styles.actionButton, { backgroundColor: colors.error }]}>
             <Text style={[styles.actionText, { color: '#FFF' }]}>Excluir</Text>
           </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.m,
    marginBottom: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.l,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  author: {
    fontSize: fontSize.s,
    color: colors.textLight,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: fontSize.m,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.m,
    gap: spacing.s,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  actionText: {
    fontSize: fontSize.s,
    fontWeight: 'bold',
    color: colors.text,
  }
});
