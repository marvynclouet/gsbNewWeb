class Invoice {
  final int id;
  final double total;
  final String date;
  final List<InvoiceItem> items;

  Invoice({
    required this.id,
    required this.total,
    required this.date,
    required this.items,
  });

  factory Invoice.fromJson(Map<String, dynamic> json) {
    return Invoice(
      id: json['id'],
      total: json['total'].toDouble(),
      date: json['date'],
      items: (json['items'] as List)
          .map((item) => InvoiceItem.fromJson(item))
          .toList(),
    );
  }
}

class InvoiceItem {
  final int id;
  final String medicamentName;
  final int quantity;
  final double price;

  InvoiceItem({
    required this.id,
    required this.medicamentName,
    required this.quantity,
    required this.price,
  });

  factory InvoiceItem.fromJson(Map<String, dynamic> json) {
    return InvoiceItem(
      id: json['id'],
      medicamentName: json['medicament_name'],
      quantity: json['quantity'],
      price: json['price'].toDouble(),
    );
  }
} 