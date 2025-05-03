import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';
import 'package:gsb_pharmacy_app/models/invoice.dart';
import 'package:gsb_pharmacy_app/models/stock.dart';
import 'package:gsb_pharmacy_app/models/order.dart';
import 'package:intl/intl.dart';

/// Écran d'accueil de l'application
/// Affiche les statistiques principales et les actions rapides
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Variables d'état
  bool _isLoading = true; // Indicateur de chargement
  int _totalOrders = 0; // Nombre total de commandes
  double _totalSales = 0; // Total des ventes
  int _totalMedicaments = 0; // Nombre total de médicaments
  double _totalExpenses = 0; // Total des dépenses
  String? _errorMessage; // Message d'erreur

  @override
  void initState() {
    super.initState();
    _loadData(); // Chargement des données au démarrage
  }

  /// Charge les données depuis l'API
  Future<void> _loadData() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Chargement des commandes
      final orders = await ApiService.getOrders();
      _totalOrders = orders.length;

      // Calcul du total des médicaments en stock
      Map<String, int> medicamentsMap = {};
      for (var order in orders) {
        if (order['items'] != null) {
          for (var item in order['items']) {
            final name = item['name'];
            final quantity = (item['quantity'] as num).toInt();
            if (medicamentsMap.containsKey(name)) {
              medicamentsMap[name] = medicamentsMap[name]! + quantity;
            } else {
              medicamentsMap[name] = quantity;
            }
          }
        }
      }
      _totalMedicaments =
          medicamentsMap.values.fold(0, (sum, quantity) => sum + quantity);

      // Chargement des factures pour le total des transactions
      final invoices = await ApiService.getInvoices();
      _totalSales = invoices.fold(0.0, (sum, invoice) => sum + invoice.total);

      // Calcul des dépenses
      _totalExpenses = orders.fold(0.0, (sum, order) {
        try {
          final items = order['items'] as List;
          return sum +
              items.fold(
                  0.0,
                  (itemSum, item) =>
                      itemSum +
                      (item['quantity'] as num) * (item['price'] as num));
        } catch (e) {
          print(
              'Erreur lors du calcul des dépenses pour la commande ${order['id']}: $e');
          return sum;
        }
      });

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Erreur lors du chargement des données: $e';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_errorMessage!),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Configuration du format de la devise
    final currencyFormat = NumberFormat.currency(locale: 'fr_FR', symbol: '€');
    final screenWidth = MediaQuery.of(context).size.width;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Accueil',
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: theme.colorScheme.primaryContainer,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // En-tête avec les informations principales
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bienvenue ${ApiService.userName ?? ''}',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Gérez votre pharmacie efficacement',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Affichage du stock total
                    Row(
                      children: [
                        Icon(
                          Icons.medication,
                          color: Colors.white,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Stock total: $_totalMedicaments médicaments',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Affichage du nombre de commandes
                    Row(
                      children: [
                        Icon(
                          Icons.shopping_cart,
                          color: Colors.white,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Nombre de commandes: $_totalOrders',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Section des actions rapides
              Text(
                'Actions rapides',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
              const SizedBox(height: 16),
              // Grille des actions rapides
              LayoutBuilder(
                builder: (context, constraints) {
                  final crossAxisCount = constraints.maxWidth > 600 ? 4 : 2;
                  return GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: crossAxisCount,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.2,
                    children: [
                      _buildActionCard(
                        context,
                        'Commandes',
                        Icons.local_shipping,
                        () {
                          Navigator.pushNamed(context, '/orders');
                        },
                      ),
                      _buildActionCard(
                        context,
                        'Stocks',
                        Icons.inventory,
                        () {
                          Navigator.pushNamed(context, '/stocks');
                        },
                      ),
                      _buildActionCard(
                        context,
                        'Factures',
                        Icons.receipt_long,
                        () {
                          Navigator.pushNamed(context, '/invoices');
                        },
                      ),
                      _buildActionCard(
                        context,
                        'Mon Profil',
                        Icons.person,
                        () {
                          Navigator.pushNamed(context, '/mobile');
                        },
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Construit une carte d'action avec un titre et une icône
  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap,
  ) {
    final theme = Theme.of(context);
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 40,
                color: theme.colorScheme.primary,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
