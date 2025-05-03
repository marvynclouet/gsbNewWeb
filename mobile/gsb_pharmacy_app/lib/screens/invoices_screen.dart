import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';

/// Écran de visualisation des factures
/// Affiche la liste des factures avec leurs détails
class InvoicesScreen extends StatefulWidget {
  const InvoicesScreen({super.key});

  @override
  State<InvoicesScreen> createState() => _InvoicesScreenState();
}

class _InvoicesScreenState extends State<InvoicesScreen> {
  // Variables d'état
  List<Map<String, dynamic>> _invoices = []; // Liste des factures
  bool _isLoading = true; // Indicateur de chargement
  double _totalAmount = 0; // Montant total des factures

  @override
  void initState() {
    super.initState();
    _loadInvoices(); // Chargement des factures au démarrage
  }

  /// Charge les factures depuis l'API
  Future<void> _loadInvoices() async {
    try {
      final orders = await ApiService.getOrders();
      setState(() {
        _invoices = orders;
        _totalAmount = orders.fold(
            0.0, (sum, order) => sum + double.parse(order['total']));
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Factures'),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadInvoices,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // En-tête avec le total des transactions
                Container(
                  padding: const EdgeInsets.all(16.0),
                  color: Theme.of(context).colorScheme.primaryContainer,
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
                        '${_totalAmount.toStringAsFixed(2)}€',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
                // Liste des factures
                Expanded(
                  child: _invoices.isEmpty
                      ? const Center(
                          child: Text('Aucune facture trouvée'),
                        )
                      : ListView.builder(
                          itemCount: _invoices.length,
                          itemBuilder: (context, index) {
                            final invoice = _invoices[index];
                            return Card(
                              margin: const EdgeInsets.all(8.0),
                              child: ExpansionTile(
                                // En-tête de la facture
                                title: Text('Facture #${invoice['id']}'),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Date: ${invoice['created_at']}'),
                                    Text(
                                        'Montant: ${double.parse(invoice['total']).toStringAsFixed(2)}€'),
                                    Text('Statut: ${invoice['status']}'),
                                  ],
                                ),
                                // Détails de la facture
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Détails de la commande',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        // Liste des articles
                                        if (invoice['items'] != null)
                                          ...invoice['items']
                                              .map<Widget>((item) => ListTile(
                                                    title: Text(item['name']),
                                                    subtitle: Text(
                                                        'Quantité: ${item['quantity']}'),
                                                    trailing: Text(
                                                        '${item['price'].toStringAsFixed(2)}€'),
                                                  )),
                                        const Divider(),
                                        // Calcul du total HT
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            const Text('Total HT:'),
                                            Text(
                                                '${(double.parse(invoice['total']) / 1.2).toStringAsFixed(2)}€'),
                                          ],
                                        ),
                                        // Calcul de la TVA
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            const Text('TVA (20%):'),
                                            Text(
                                                '${(double.parse(invoice['total']) - double.parse(invoice['total']) / 1.2).toStringAsFixed(2)}€'),
                                          ],
                                        ),
                                        const Divider(),
                                        // Total TTC
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            const Text(
                                              'Total TTC:',
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold),
                                            ),
                                            Text(
                                              '${double.parse(invoice['total']).toStringAsFixed(2)}€',
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.bold),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
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
