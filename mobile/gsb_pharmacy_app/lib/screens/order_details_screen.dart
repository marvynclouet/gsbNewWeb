import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';

/// Écran de détails d'une commande
/// Affiche les informations détaillées d'une commande spécifique
class OrderDetailsScreen extends StatefulWidget {
  const OrderDetailsScreen({super.key});

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState();
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  // Variables d'état
  Map<String, dynamic>? _orderDetails; // Détails de la commande
  Map<String, dynamic>? _invoice; // Facture associée
  bool _isLoading = true; // Indicateur de chargement

  @override
  void initState() {
    super.initState();
    _loadOrderDetails(); // Chargement des détails au démarrage
  }

  /// Charge les détails de la commande depuis l'API
  Future<void> _loadOrderDetails() async {
    try {
      final orderDetails =
          ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
      final details =
          await ApiService.getOrderDetails(orderDetails['id'].toString());
      final invoice =
          await ApiService.getInvoice(orderDetails['id'].toString());

      setState(() {
        _orderDetails = details;
        _invoice = invoice;
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

  @override
  Widget build(BuildContext context) {
    // Calcul du total des transactions
    final totalTransactions = _orderDetails?['items']?.fold<double>(
            0.0, (sum, item) => sum + (item['quantity'] * item['price'])) ??
        0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Détails de la commande'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _orderDetails == null
              ? const Center(child: Text('Commande non trouvée'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Carte des informations principales
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Commande #${_orderDetails!['id']}',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text('Date: ${_orderDetails!['date']}'),
                              Text('Statut: ${_orderDetails!['status']}'),
                              Text(
                                  'Total: ${_orderDetails!['totalAmount'].toStringAsFixed(2)}€'),
                              const SizedBox(height: 8),
                              Text(
                                'Total des transactions: ${totalTransactions.toStringAsFixed(2)}€',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Liste des articles
                      const Text(
                        'Articles',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _orderDetails!['items'].length,
                        itemBuilder: (context, index) {
                          final item = _orderDetails!['items'][index];
                          return ListTile(
                            title: Text(item['name']),
                            subtitle: Text('Quantité: ${item['quantity']}'),
                            trailing:
                                Text('${item['price'].toStringAsFixed(2)}€'),
                          );
                        },
                      ),
                      // Section de la facture
                      if (_invoice != null) ...[
                        const SizedBox(height: 16),
                        const Text(
                          'Facture',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                    'Numéro de facture: ${_invoice!['invoiceNumber']}'),
                                Text(
                                    'Date de facture: ${_invoice!['invoiceDate']}'),
                                Text(
                                    'Montant HT: ${_invoice!['amountHT'].toStringAsFixed(2)}€'),
                                Text(
                                    'TVA (20%): ${_invoice!['tva'].toStringAsFixed(2)}€'),
                                const Divider(),
                                Text(
                                  'Total TTC: ${_invoice!['amountTTC'].toStringAsFixed(2)}€',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
    );
  }
}
