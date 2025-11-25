import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MenuItem } from '@/lib/dataClient';
import { SortConfig } from '@/hooks/useRestaurantStore';

import { layout, palette } from './theme';

type Props = {
  sortedItems: MenuItem[];
  totalAvailable: number;
  isLoadingMenu: boolean;
  statusMessage: string;
  refreshMenu: () => void;
  handleEdit: (item: MenuItem) => void;
  handleToggleAvailability: (item: MenuItem) => void;
  handleDelete: (item: MenuItem) => void;
  toggleSort: (key: SortConfig['key']) => void;
  sortConfig: SortConfig;
};

function formatCurrency(value?: number) {
  if (typeof value !== 'number') return '—';
  try {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch {
    return `R$ ${value.toFixed(2)}`;
  }
}

export function MenuTable({
  sortedItems,
  totalAvailable,
  isLoadingMenu,
  statusMessage,
  refreshMenu,
  handleEdit,
  handleToggleAvailability,
  handleDelete,
  toggleSort,
  sortConfig,
}: Props) {

  const renderSortIndicator = (column: SortConfig['key']) => {
    if (sortConfig.key !== column) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <View style={styles.section}>

      {/* Cabeçalho */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.title}>Cardápio cadastrado</Text>
          <Text style={styles.subtitle}>
            Total de pratos exibidos: {sortedItems.length} | Disponíveis: {totalAvailable}
          </Text>
        </View>

        <Pressable
          style={[styles.button, styles.primaryButton, isLoadingMenu && styles.buttonDisabled]}
          onPress={refreshMenu}
          disabled={isLoadingMenu}
        >
          <Text style={styles.primaryButtonText}>Atualizar lista</Text>
        </Pressable>
      </View>

      {statusMessage !== '' && (
        <Text style={styles.feedback}>{statusMessage}</Text>
      )}

      {isLoadingMenu && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={palette.accentDark} />
          <Text style={styles.subtitle}>Carregando itens...</Text>
        </View>
      )}

      {!isLoadingMenu && sortedItems.length === 0 && (
        <Text>Nenhum prato encontrado.</Text>
      )}

      {/* Tabela */}
      {!isLoadingMenu && sortedItems.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>

            {/* HEADER */}
            <View style={[styles.row, styles.headerRow]}>
              {[
                { label: "Nome", key: "name" },
                { label: "Descrição" },
                { label: "Preço", key: "price" },
                { label: "Categoria" },
                { label: "Unidade", key: "unit" },
                { label: "Disponível" },
                { label: "Ações" },
              ].map((col, idx) => (
                <View key={idx} style={[styles.cell, styles.headerCell]}>
                  {col.key ? (
                    <Pressable onPress={() => toggleSort(col.key!)}>
                      <Text style={styles.headerText}>
                        {col.label}{renderSortIndicator(col.key!)}
                      </Text>
                    </Pressable>
                  ) : (
                    <Text style={styles.headerText}>{col.label}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* BODY */}
            {sortedItems.map((item, index) => (
              <View
                key={item.id}
                style={[styles.row, index % 2 === 1 && styles.zebraRow]}
              >
                <View style={styles.cell}><Text style={styles.cellText}>{item.name}</Text></View>
                <View style={styles.cell}><Text style={styles.cellText}>{item.description || '—'}</Text></View>
                <View style={styles.cell}><Text style={styles.cellText}>{formatCurrency(item.price)}</Text></View>
                <View style={styles.cell}><Text style={styles.cellText}>{item.category || '—'}</Text></View>
                <View style={styles.cell}><Text style={styles.cellText}>{item.unit || '—'}</Text></View>
                <View style={styles.cell}><Text style={styles.cellText}>{item.available !== false ? 'Sim' : 'Não'}</Text></View>

                {/* Botões de ação com hover + click */}
                <View style={[styles.cell, styles.actionsCell]}>

                  <Pressable
                    onPress={() => handleEdit(item)}
                    style={({ hovered, pressed }) => [
                      styles.actionButton,
                      hovered && styles.actionButtonHover,
                      pressed && styles.actionButtonPressed,
                    ]}
                  >
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleToggleAvailability(item)}
                    style={({ hovered, pressed }) => [
                      styles.actionButton,
                      hovered && styles.actionButtonHover,
                      pressed && styles.actionButtonPressed,
                    ]}
                  >
                    <Text style={styles.actionText}>Alternar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDelete(item)}
                    style={({ hovered, pressed }) => [
                      styles.actionButton,
                      hovered && styles.actionButtonHover,
                      pressed && styles.actionButtonPressed,
                    ]}
                  >
                    <Text style={styles.actionText}>Excluir</Text>
                  </Pressable>

                </View>

              </View>
            ))}

          </View>
        </ScrollView>
      )}
    </View>
  );
}

/* ==============================
   ESTILOS COM CLICK + HOVER
   ============================== */

const styles = StyleSheet.create({
  section: {
    marginBottom: 40,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.textPrimary,
  },

  subtitle: {
    color: palette.textMuted,
    fontSize: 13,
  },

  button: {
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  primaryButton: {
    backgroundColor: palette.accent,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  feedback: {
    color: palette.accentDark,
    fontWeight: '500',
    marginBottom: 12,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  /* TABELA */
  table: {
    borderWidth: 1,
    borderColor: 'rgba(66,61,49,0.12)',
    borderRadius: layout.radiusLarge,
    backgroundColor: palette.surface,
    minWidth: 1200,   // evita corte dos botões
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(66,61,49,0.08)',
  },

  zebraRow: {
    backgroundColor: 'rgba(66,61,49,0.03)',
  },

  headerRow: {
    backgroundColor: 'rgba(66,61,49,0.12)',
    paddingVertical: 10,
  },

  cell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  headerCell: {
    justifyContent: 'center',
  },

  headerText: {
    color: palette.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },

  cellText: {
    color: palette.textPrimary,
    fontSize: 14,
  },

  /* COLUNA DE AÇÕES */
  actionsCell: {
    flexDirection: 'row',
    gap: 10,
    minWidth: 260,
  },

  /* BOTÕES DE AÇÃO */
  actionButton: {
    borderWidth: 1,
    borderColor: 'rgba(66,61,49,0.28)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(66,61,49,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,

    // Animações suaves no Web
    transitionDuration: '120ms',
    transitionProperty: 'background-color, transform, box-shadow',
  },

  actionButtonHover: {
    backgroundColor: 'rgba(66,61,49,0.12)',
  },

  actionButtonPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: 'rgba(66,61,49,0.16)',
    shadowOpacity: 0.12,
  },

  actionText: {
    color: palette.accentDark,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MenuTable;