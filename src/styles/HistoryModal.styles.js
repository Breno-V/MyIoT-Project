import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayClose: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    height: '91%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    color: '#888',
    fontSize: 13,
    flex: 1,
  },
  badge: {
    backgroundColor: '#3A3A3A',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#4ECDC4',
    fontSize: 11,
    fontWeight: '600',
  },
  valueTemp: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  valueHum: {
    color: '#4ECDC4',
    fontSize: 14,
  },
  valueLightOn: {
    color: '#FFD93D',
    fontSize: 14,
  },
  valueLightOff: {
    color: '#888',
    fontSize: 14,
  },
});

export default styles;