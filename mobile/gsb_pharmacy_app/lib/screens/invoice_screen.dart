import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';
import 'package:gsb_pharmacy_app/models/invoice.dart';
import 'package:intl/intl.dart';

/// Écran de gestion des factures
/// Permet de visualiser et filtrer les factures
class InvoiceScreen extends StatefulWidget {
  const InvoiceScreen({super.key});

  @override
  State<InvoiceScreen> createState() => _InvoiceScreenState();
}

class _InvoiceScreenState extends State<InvoiceScreen> {
  // Variables d'état
  List<Invoice> _invoices = []; // Liste des factures
  bool _isLoading = true; // Indicateur de chargement
  String _searchQuery = ''; // Terme de recherche
  double _totalAmount = 0; // Montant total des factures
  String _selectedDateFilter = 'Toutes'; // Filtre de date sélectionné
  String _selectedAmountFilter = 'Tous'; // Filtre de montant sélectionné

  // Options de filtrage par date
  final List<String> _dateOptions = [
    'Toutes',
    'Aujourd\'hui',
    'Cette semaine',
    'Ce mois'
  ];

  // Options de filtrage par montant
  final List<String> _amountOptions = [
    'Tous',
    '< 100€',
    '100€ - 500€',
    '> 500€'
  ];

  @override
  void initState() {
    super.initState();
    _loadInvoices(); // Chargement des factures au démarrage
  }

  /// Charge les factures depuis l'API
  Future<void> _loadInvoices() async {
    try {
      final invoices = await ApiService.getInvoices();
      setState(() {
        _invoices = invoices;
        _totalAmount =
            invoices.fold(0.0, (sum, invoice) => sum + invoice.total);
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

  /// Filtre les factures selon les critères sélectionnés
  List<Invoice> get _filteredInvoices {
    var filtered = _invoices;

    // Filtre par recherche
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((invoice) {
        return invoice.id.toString().contains(_searchQuery);
      }).toList();
    }

    // Filtre par date
    if (_selectedDateFilter != 'Toutes') {
      final now = DateTime.now();
      filtered = filtered.where((invoice) {
        final date = DateTime.parse(invoice.date);
        switch (_selectedDateFilter) {
          case 'Aujourd\'hui':
            return date.year == now.year &&
                date.month == now.month &&
                date.day == now.day;
          case 'Cette semaine':
            final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
            return date.isAfter(startOfWeek) &&
                date.isBefore(now.add(const Duration(days: 1)));
          case 'Ce mois':
            return date.year == now.year && date.month == now.month;
          default:
            return true;
        }
      }).toList();
    }

    // Filtre par montant
    if (_selectedAmountFilter != 'Tous') {
      filtered = filtered.where((invoice) {
        switch (_selectedAmountFilter) {
          case '< 100€':
            return invoice.total < 100;
          case '100€ - 500€':
            return invoice.total >= 100 && invoice.total <= 500;
          case '> 500€':
            return invoice.total > 500;
          default:
            return true;
        }
      }).toList();
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'fr_FR', symbol: '€');
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Factures',
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: theme.colorScheme.primaryContainer,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadInvoices,
          ),
        ],
      ),
      body: Column(
        children: [
          // En-tête avec le total des transactions
          Container(
            padding: const EdgeInsets.all(16.0),
            color: theme.colorScheme.primaryContainer,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Total des transactions:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  currencyFormat.format(_totalAmount),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
          // Zone de recherche et filtres
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Champ de recherche
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Rechercher une facture...',
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
                const SizedBox(height: 12),
                // Filtres
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Filtre par date
                      const Text(
                        'Filtrer par date:',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: _dateOptions.map((date) {
                            final isSelected = date == _selectedDateFilter;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: FilterChip(
                                label: Text(date),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedDateFilter = date;
                                  });
                                },
                                backgroundColor: Colors.grey[200],
                                selectedColor:
                                    theme.colorScheme.primary.withOpacity(0.2),
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
                      const SizedBox(height: 12),
                      // Filtre par montant
                      const Text(
                        'Filtrer par montant:',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: _amountOptions.map((amount) {
                            final isSelected = amount == _selectedAmountFilter;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: FilterChip(
                                label: Text(amount),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedAmountFilter = amount;
                                  });
                                },
                                backgroundColor: Colors.grey[200],
                                selectedColor:
                                    theme.colorScheme.primary.withOpacity(0.2),
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
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Liste des factures
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _invoices.isEmpty
                    ? const Center(
                        child: Text('Aucune facture trouvée'),
                      )
                    : ListView.builder(
                        itemCount: _filteredInvoices.length,
                        itemBuilder: (context, index) {
                          final invoice = _filteredInvoices[index];
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
                                  '/transactions',
                                  arguments: {'id': invoice.id},
                                );
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // En-tête de la facture
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Facture #${invoice.id}',
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
                                            color:
                                                Colors.green.withOpacity(0.2),
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                          child: const Text(
                                            'Payée',
                                            style: TextStyle(
                                              color: Colors.green,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    // Date de la facture
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.calendar_today,
                                          size: 16,
                                          color: Colors.grey[600],
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          DateFormat('dd/MM/yyyy').format(
                                              DateTime.parse(invoice.date)),
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
                                        const SizedBox(width: 8),
                                        Text(
                                          '${invoice.items.length} articles',
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
                                          currencyFormat.format(invoice.total),
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
                                        Text(
                                          'Voir les détails',
                                          style: TextStyle(
                                            color: theme.colorScheme.primary,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Icon(
                                          Icons.arrow_forward,
                                          size: 16,
                                          color: theme.colorScheme.primary,
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
