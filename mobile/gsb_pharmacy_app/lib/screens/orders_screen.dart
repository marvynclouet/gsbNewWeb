import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';
import 'package:intl/intl.dart';

/// Écran de gestion des commandes
/// Permet de visualiser et filtrer les commandes
class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  // Variables d'état
  List<Map<String, dynamic>> _orders = []; // Liste des commandes
  bool _isLoading = true; // Indicateur de chargement
  String _searchQuery = ''; // Terme de recherche
  String _selectedStatus = 'all'; // Statut sélectionné
  String _selectedDateFilter = 'all'; // Filtre de date sélectionné
  String _selectedPriceFilter = 'all'; // Filtre de prix sélectionné
  bool _showFilters = false; // Affichage des filtres

  // Traductions des statuts
  final Map<String, String> _statusTranslations = {
    'all': 'Tous',
    'pending': 'En cours',
    'delivered': 'Livré',
    'cancelled': 'Annulé'
  };

  // Options de filtrage par date
  final Map<String, String> _dateOptions = {
    'all': 'Toutes',
    'today': 'Aujourd\'hui',
    'week': 'Cette semaine',
    'month': 'Ce mois'
  };

  // Options de filtrage par prix
  final Map<String, String> _priceOptions = {
    'all': 'Tous',
    'low': '< 100€',
    'medium': '100€ - 500€',
    'high': '> 500€'
  };

  // Getters pour les options de filtrage
  List<String> get _statusOptions => _statusTranslations.values.toList();
  List<String> get _dateFilterOptions => _dateOptions.values.toList();
  List<String> get _priceFilterOptions => _priceOptions.values.toList();

  /// Convertit un statut affiché en clé
  String _getStatusKey(String displayStatus) {
    return _statusTranslations.entries
        .firstWhere((entry) => entry.value == displayStatus)
        .key;
  }

  /// Convertit une date affichée en clé
  String _getDateKey(String displayDate) {
    return _dateOptions.entries
        .firstWhere((entry) => entry.value == displayDate)
        .key;
  }

  /// Convertit un prix affiché en clé
  String _getPriceKey(String displayPrice) {
    return _priceOptions.entries
        .firstWhere((entry) => entry.value == displayPrice)
        .key;
  }

  /// Convertit une clé de statut en texte affiché
  String _getDisplayStatus(String status) {
    return _statusTranslations[status.toLowerCase()] ?? status;
  }

  @override
  void initState() {
    super.initState();
    _loadOrders(); // Chargement des commandes au démarrage
  }

  /// Charge les commandes depuis l'API
  Future<void> _loadOrders() async {
    try {
      final orders = await ApiService.getOrders();
      setState(() {
        _orders = orders;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur de chargement: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  /// Filtre les commandes selon les critères sélectionnés
  List<Map<String, dynamic>> get _filteredOrders {
    var filtered = _orders;

    // Filtre par recherche
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((order) {
        return order['id'].toString().contains(_searchQuery);
      }).toList();
    }

    // Filtre par statut
    if (_selectedStatus != 'all') {
      filtered = filtered.where((order) {
        return order['status'].toLowerCase() == _selectedStatus;
      }).toList();
    }

    // Filtre par date
    if (_selectedDateFilter != 'all') {
      final now = DateTime.now();
      filtered = filtered.where((order) {
        final date = DateTime.parse(order['created_at']);
        switch (_selectedDateFilter) {
          case 'today':
            return date.year == now.year &&
                date.month == now.month &&
                date.day == now.day;
          case 'week':
            final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
            return date.isAfter(startOfWeek) &&
                date.isBefore(now.add(const Duration(days: 1)));
          case 'month':
            return date.year == now.year && date.month == now.month;
          default:
            return true;
        }
      }).toList();
    }

    // Filtre par prix
    if (_selectedPriceFilter != 'all') {
      filtered = filtered.where((order) {
        final total = double.parse(order['total']);
        switch (_selectedPriceFilter) {
          case 'low':
            return total < 100;
          case 'medium':
            return total >= 100 && total <= 500;
          case 'high':
            return total > 500;
          default:
            return true;
        }
      }).toList();
    }

    return filtered;
  }

  /// Retourne la couleur associée à un statut
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'delivered':
        return Colors.green;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat.currency(locale: 'fr_FR', symbol: '€');

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Commandes',
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: theme.colorScheme.primaryContainer,
        actions: [
          // Bouton pour afficher/masquer les filtres
          IconButton(
            icon: Icon(
              _showFilters ? Icons.filter_list_off : Icons.filter_list,
              color: theme.colorScheme.primary,
            ),
            onPressed: () {
              setState(() {
                _showFilters = !_showFilters;
              });
            },
          ),
          // Bouton de rafraîchissement
          IconButton(
            icon: Icon(
              Icons.refresh,
              color: theme.colorScheme.primary,
            ),
            onPressed: _loadOrders,
          ),
        ],
      ),
      body: Column(
        children: [
          // Champ de recherche
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Rechercher une commande...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),
          // Panneau des filtres
          if (_showFilters)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 3,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Column(
                children: [
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.all(12.0),
                          child: Text(
                            'Filtres',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        // Filtre par statut
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12.0),
                          child: Text(
                            'Filtrer par statut:',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 12.0),
                            child: Row(
                              children: _statusOptions.map((displayStatus) {
                                final statusKey = _getStatusKey(displayStatus);
                                final isSelected = statusKey == _selectedStatus;
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: FilterChip(
                                    label: Text(displayStatus),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      setState(() {
                                        _selectedStatus = statusKey;
                                      });
                                    },
                                    backgroundColor: Colors.grey[200],
                                    selectedColor: theme.colorScheme.primary
                                        .withOpacity(0.2),
                                    labelStyle: TextStyle(
                                      color: isSelected
                                          ? theme.colorScheme.primary
                                          : Colors.black,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Filtre par date
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12.0),
                          child: Text(
                            'Filtrer par date:',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 12.0),
                            child: Row(
                              children: _dateFilterOptions.map((displayDate) {
                                final dateKey = _getDateKey(displayDate);
                                final isSelected =
                                    dateKey == _selectedDateFilter;
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: FilterChip(
                                    label: Text(displayDate),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      setState(() {
                                        _selectedDateFilter = dateKey;
                                      });
                                    },
                                    backgroundColor: Colors.grey[200],
                                    selectedColor: theme.colorScheme.primary
                                        .withOpacity(0.2),
                                    labelStyle: TextStyle(
                                      color: isSelected
                                          ? theme.colorScheme.primary
                                          : Colors.black,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Filtre par prix
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12.0),
                          child: Text(
                            'Filtrer par prix:',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 12.0),
                            child: Row(
                              children: _priceFilterOptions.map((displayPrice) {
                                final priceKey = _getPriceKey(displayPrice);
                                final isSelected =
                                    priceKey == _selectedPriceFilter;
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: FilterChip(
                                    label: Text(displayPrice),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      setState(() {
                                        _selectedPriceFilter = priceKey;
                                      });
                                    },
                                    backgroundColor: Colors.grey[200],
                                    selectedColor: theme.colorScheme.primary
                                        .withOpacity(0.2),
                                    labelStyle: TextStyle(
                                      color: isSelected
                                          ? theme.colorScheme.primary
                                          : Colors.black,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          // Liste des commandes
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _orders.isEmpty
                    ? const Center(
                        child: Text('Aucune commande trouvée'),
                      )
                    : ListView.builder(
                        itemCount: _filteredOrders.length,
                        itemBuilder: (context, index) {
                          final order = _filteredOrders[index];
                          final statusColor = _getStatusColor(order['status']);
                          final date = DateTime.parse(order['created_at']);
                          final formattedDate =
                              DateFormat('dd/MM/yyyy').format(date);

                          return Card(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 16.0,
                              vertical: 8.0,
                            ),
                            elevation: 2,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: InkWell(
                              onTap: () {
                                Navigator.pushNamed(
                                  context,
                                  '/order-details',
                                  arguments: {'id': order['id']},
                                );
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // En-tête de la commande
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Commande #${order['id']}',
                                          style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: statusColor.withOpacity(0.2),
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                          child: Text(
                                            _getDisplayStatus(order['status']),
                                            style: TextStyle(
                                              color: statusColor,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    // Date de la commande
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.calendar_today,
                                          size: 16,
                                          color: Colors.grey[600],
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          formattedDate,
                                          style: TextStyle(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    // Nombre d'articles
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.shopping_cart,
                                          size: 16,
                                          color: Colors.grey[600],
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${order['items']?.length ?? 0} articles',
                                          style: TextStyle(
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    // Montant total
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Total:',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w500,
                                            color: Colors.grey[800],
                                          ),
                                        ),
                                        Text(
                                          currencyFormat.format(
                                              double.parse(order['total'])),
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Colors.green,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    // Bouton de détails
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.end,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: theme.colorScheme.primary
                                                .withOpacity(0.1),
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                          child: Row(
                                            children: [
                                              Text(
                                                'Voir les détails',
                                                style: TextStyle(
                                                  color:
                                                      theme.colorScheme.primary,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              Icon(
                                                Icons.arrow_forward,
                                                size: 16,
                                                color:
                                                    theme.colorScheme.primary,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
