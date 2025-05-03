import 'package:flutter/material.dart';
import 'package:gsb_pharmacy_app/services/api_service.dart';

class StockScreen extends StatefulWidget {
  const StockScreen({super.key});

  @override
  State<StockScreen> createState() => _StockScreenState();
}

class _StockScreenState extends State<StockScreen> {
  List<Map<String, dynamic>> _medicaments = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadMedicaments();
  }

  Future<void> _loadMedicaments() async {
    try {
      final orders = await ApiService.getOrders();
      // Créer un Map pour stocker les médicaments et leurs quantités
      Map<String, Map<String, dynamic>> medicamentsMap = {};

      // Parcourir toutes les commandes pour compter les médicaments
      for (var order in orders) {
        if (order['items'] != null) {
          for (var item in order['items']) {
            final name = item['name'];
            final quantity = item['quantity'];
            final price = item['price'];

            if (medicamentsMap.containsKey(name)) {
              medicamentsMap[name]!['quantity'] += quantity;
              medicamentsMap[name]!['total_orders'] += 1;
            } else {
              medicamentsMap[name] = {
                'name': name,
                'quantity': quantity,
                'price': price,
                'total_orders': 1,
              };
            }
          }
        }
      }

      setState(() {
        _medicaments = medicamentsMap.values.toList();
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

  List<Map<String, dynamic>> get _filteredMedicaments {
    if (_searchQuery.isEmpty) return _medicaments;
    return _medicaments.where((med) {
      return med['name']
          .toString()
          .toLowerCase()
          .contains(_searchQuery.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final totalStock =
        _medicaments.fold<int>(0, (sum, med) => sum + (med['quantity'] as int));

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Stocks',
          style: TextStyle(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMedicaments,
          ),
        ],
      ),
      body: Column(
        children: [
          Card(
            margin: const EdgeInsets.all(16.0),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Stock Total:',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '$totalStock médicaments',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Rechercher un médicament...',
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
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _medicaments.isEmpty
                    ? const Center(
                        child: Text('Aucun médicament trouvé'),
                      )
                    : ListView.builder(
                        itemCount: _filteredMedicaments.length,
                        itemBuilder: (context, index) {
                          final medicament = _filteredMedicaments[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(
                              horizontal: 16.0,
                              vertical: 8.0,
                            ),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Theme.of(context)
                                    .colorScheme
                                    .primaryContainer,
                                child: Text(
                                  medicament['quantity'].toString(),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              title: Text(
                                medicament['name'],
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.inventory_2,
                                        size: 16,
                                        color: Colors.grey[600],
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        '${medicament['quantity']} unités',
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                      if (medicament['quantity'] < 30) ...[
                                        const SizedBox(width: 8),
                                        Icon(
                                          Icons.warning_amber_rounded,
                                          size: 16,
                                          color: Colors.red,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Stock faible',
                                          style: TextStyle(
                                            color: Colors.red,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                  Text(
                                      'Prix unitaire: ${medicament['price'].toStringAsFixed(2)}€'),
                                  Text(
                                      'Commandé dans ${medicament['total_orders']} commandes'),
                                ],
                              ),
                              trailing: IconButton(
                                icon: const Icon(Icons.info_outline),
                                onPressed: () {
                                  showDialog(
                                    context: context,
                                    builder: (context) => AlertDialog(
                                      title: Text(medicament['name']),
                                      content: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                              'Quantité en stock: ${medicament['quantity']}'),
                                          Text(
                                              'Prix unitaire: ${medicament['price'].toStringAsFixed(2)}€'),
                                          Text(
                                              'Nombre de commandes: ${medicament['total_orders']}'),
                                          const SizedBox(height: 16),
                                          const Text(
                                            'Détails des commandes:',
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold),
                                          ),
                                          // TODO: Ajouter la liste des commandes pour ce médicament
                                        ],
                                      ),
                                      actions: [
                                        TextButton(
                                          onPressed: () =>
                                              Navigator.pop(context),
                                          child: const Text('Fermer'),
                                        ),
                                      ],
                                    ),
                                  );
                                },
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
